package services

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"todo-server/helpers"
)

type UserService struct {
	Repository UserRepository
}

type UserRegisterParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (u *UserService) HandleSignup(w http.ResponseWriter, r *http.Request) {
	helpers.SetHeader(&w)
	params := &UserRegisterParams{}
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(params); err != nil {
		helpers.HandleError(errors.New("could not read params"), w, 400)
		return
	}

	if err := validateRegisterParams(params); err != nil {
		helpers.HandleError(err, w, 400)
		return
	}

	if _, err := u.Repository.Get(params.Email); err == nil {
		helpers.HandleError(errors.New("email is already used, try to sign in"), w, 400)
	}
	passwordDigest := md5.New().Sum([]byte(params.Password))

	newUser := User{
		Email:          params.Email,
		PasswordDigest: string(passwordDigest),
		Lists:          make(map[int]List),
		ListCounter:    0,
	}

	if err := u.Repository.Add(params.Email, newUser); err != nil {
		helpers.HandleError(err, w, 400)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("registered"))
	log.Printf(params.Email + " registered")
}

func validateRegisterParams(p *UserRegisterParams) error {

	if err := helpers.ValidatePassword(p.Password); err != nil {
		return err
	}

	if err := helpers.ValidateEmail(p.Email); err != nil {
		return err
	}

	return nil
}
