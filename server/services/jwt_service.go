package services

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"todo-server/helpers"

	"github.com/openware/rango/pkg/auth"
)

type JWTService struct {
	keys *auth.KeyStore
}

func NewJWTService(privKeyPath, pubKeyPath string) (*JWTService, error) {
	keys, err := auth.LoadOrGenerateKeys(privKeyPath, pubKeyPath)
	if err != nil {
		return nil, err
	}
	return &JWTService{keys: keys}, nil
}

func (j *JWTService) GenerateJWT(u User) (string, error) {
	return auth.ForgeToken("empty", u.Email, "empty", 0, j.keys.PrivateKey, nil)
}
func (j *JWTService) ParseJWT(jwt string) (auth.Auth, error) {
	return auth.ParseAndValidate(jwt, j.keys.PublicKey)
}

type JWTParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (u *UserService) JWT(w http.ResponseWriter, r *http.Request, jwtService *JWTService) {
	params := &JWTParams{}
	err := json.NewDecoder(r.Body).Decode(params)
	if err != nil {
		helpers.HandleError(errors.New("could not read params"), w, 400)
		return
	}
	passwordDigest := md5.New().Sum([]byte(params.Password))
	user, err := u.Repository.Get(params.Email)
	if err != nil {
		helpers.HandleError(err, w, 400)
		return
	}
	if string(passwordDigest) != user.PasswordDigest {
		helpers.HandleError(errors.New("invalid login params"), w, 400)
		return
	}
	token, err := jwtService.GenerateJWT(user)
	if err != nil {
		helpers.HandleError(err, w, 400)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(token))
	log.Print("User " + params.Email + " entered")
}

type ProtectedHandler func(rw http.ResponseWriter, r *http.Request, u *User)

func (j *JWTService) JwtAuth(users UserRepository, h ProtectedHandler) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		helpers.SetHeader(&rw)
		if r.Method == "OPTIONS" {
			rw.WriteHeader(204)
			return
		}
		authHeader := r.Header.Get("Authorization")
		token := strings.TrimPrefix(authHeader, "Bearer ")
		auth, err := j.ParseJWT(token)
		if err != nil {
			helpers.HandleError(errors.New("unauthorized"), rw, 401)
			return
		}
		user, err := users.Get(auth.Email)

		if err != nil {
			helpers.HandleError(errors.New("unauthorized"), rw, 401)
			return
		}

		h(rw, r, &user)
		users.Update(user.Email, user)
	}
}
