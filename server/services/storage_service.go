package services

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"todo-server/helpers"

	"github.com/gorilla/mux"
)

type ListReturnValue struct {
	Id   int
	Name string
}

type ListCallParams struct {
	Name string `json:"name"`
}

func HandleGettingLists(rw http.ResponseWriter, r *http.Request, u *User) {
	lists := make([]ListReturnValue, 0, len(u.Lists))
	for _, list := range (*u).Lists {
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

func HandleAddingLists(rw http.ResponseWriter, r *http.Request, u *User) {
	params := &ListCallParams{}

	if err := json.NewDecoder(r.Body).Decode(params); err != nil {
		helpers.HandleError(errors.New("could not read params"), rw, 400)
		return
	}

	id := (*u).ListCounter
	(*u).ListCounter = (*u).ListCounter + 1

	(*u).Lists[id] = List{
		Name:        params.Name,
		Id:          id,
		Tasks:       make(map[int]Task),
		TaskCounter: 0,
	}

	response := ListReturnValue{
		Id:   id,
		Name: params.Name,
	}

	js, err := json.Marshal(response)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}

	rw.WriteHeader(201)
	rw.Write(js)
	log.Print(u.Email + " created list " + params.Name)
}

func HandleUpdatingList(rw http.ResponseWriter, r *http.Request, u *User) {
	params := &ListCallParams{}

	if err := json.NewDecoder(r.Body).Decode(params); err != nil {
		helpers.HandleError(errors.New("could not read params"), rw, 400)
		return
	}

	id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	if list, ok := (*u).Lists[id]; ok {
		log.Print((*u).Email + " updated list " + list.Name + " to " + params.Name)
		list.Name = params.Name
		(*u).Lists[id] = list
	} else {
		helpers.HandleError(errors.New("no list with this index"), rw, 400)
		return
	}

	response := ListReturnValue{
		Id:   id,
		Name: params.Name,
	}

	js, err := json.Marshal(response)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}

	rw.WriteHeader(201)
	rw.Write(js)
}

func HandleDeletingList(rw http.ResponseWriter, r *http.Request, u *User) {
	id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	if list, ok := (*u).Lists[id]; ok {
		log.Print((*u).Email + " deleted list " + list.Name)
		delete((*u).Lists, id)
	} else {
		helpers.HandleError(errors.New("no list with this index"), rw, 400)
		return
	}

	rw.WriteHeader(204)
	rw.Write([]byte(""))
}
