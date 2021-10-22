package helpers

import (
	"log"
	"net/http"
)

func HandleError(err error, w http.ResponseWriter, status int) {
	w.WriteHeader(status)
	w.Write([]byte(err.Error()))
	log.Print("ERR: " + err.Error())
}
