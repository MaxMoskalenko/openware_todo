package services

import (
	"encoding/json"
	"log"
	"net/http"
	"todo-server/helpers"
)

type ListReturnValue struct {
	Id   int
	Name string
}

func HandleGettingLists(rw http.ResponseWriter, r *http.Request, u User) {
	lists := make([]ListReturnValue, 0, len(u.Lists))
	for _, list := range u.Lists {
		lists = append(
			lists,
			ListReturnValue{
				Id:   list.Id,
				Name: list.Name,
			},
		)
	}

	js, err := json.Marshal(lists)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}
	rw.WriteHeader(200)
	rw.Write(js)
	log.Print(u.Email + " get his/her lists")
}
