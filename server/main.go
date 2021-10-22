package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"todo-server/helpers"
	"todo-server/services"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	users := services.NewInMemoryUserStorage()
	userService := services.UserService{Repository: users}

	jwtService, err := services.NewJWTService("pubkey.rsa", "privkey.rsa")
	if err != nil {
		panic(err)
	}

	r.HandleFunc("/user/signup", userService.HandleSignup).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/signin", wrapJwt(jwtService, userService.JWT)).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/lists", jwtService.JwtAuth(userService.Repository, services.HandleGettingLists)).Methods("GET", "OPTIONS")
	r.HandleFunc("/user/lists", jwtService.JwtAuth(userService.Repository, services.HandleAddingLists)).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}", jwtService.JwtAuth(userService.Repository, services.HandleUpdatingList)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}", jwtService.JwtAuth(userService.Repository, services.HandleDeletingList)).Methods("DELETE", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}/tasks", jwtService.JwtAuth(userService.Repository, services.HandleGettingTasks)).Methods("GET", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}/tasks", jwtService.JwtAuth(userService.Repository, services.HandleAddingTasks)).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}/tasks/{task_id}", jwtService.JwtAuth(userService.Repository, services.HandleUpdatingTask)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/user/lists/{list_id}/tasks/{task_id}", jwtService.JwtAuth(userService.Repository, services.HandleDeletingTask)).Methods("DELETE", "OPTIONS")

	srv := http.Server{
		Addr:    ":9001",
		Handler: r,
	}

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	go func() {
		<-interrupt
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		srv.Shutdown(ctx)
	}()

	log.Println("Server started, hit Ctrl+C to stop")
	if err := srv.ListenAndServe(); err != nil {
		log.Println("Server exited with error:", err)
	}
	log.Println("Good bye :)")
}

func wrapJwt(jwt *services.JWTService, f func(http.ResponseWriter, *http.Request, *services.JWTService)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		helpers.SetHeader(&w)
		if r.Method == "OPTIONS" {
			w.WriteHeader(204)
			return
		}
		f(w, r, jwt)
	}
}
