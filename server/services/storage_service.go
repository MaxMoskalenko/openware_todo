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

type ListCallParams struct {
	Name string `json:"name"`
}

type ListReturnValue struct {
	Id   int
	Name string
}

type TaskCallParams struct {
	Name        string `json:"task_name"`
	Description string `json:"description"`
	Status      string `json:"status"`
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

func HandleAddingTasks(rw http.ResponseWriter, r *http.Request, u *User) {
	params := &TaskCallParams{}

	if err := json.NewDecoder(r.Body).Decode(params); err != nil {
		helpers.HandleError(errors.New("could not read params"), rw, 400)
		return
	}

	id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	list, ok := (*u).Lists[id]
	if !ok {
		helpers.HandleError(errors.New("specified list does not exist"), rw, 422)
	}

	response := Task{
		Id:          list.TaskCounter,
		Name:        params.Name,
		Description: params.Description,
		Status:      params.Status,
	}

	list.Tasks[list.TaskCounter] = response
	list.TaskCounter++
	(*u).Lists[id] = list

	js, err := json.Marshal(response)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}

	rw.WriteHeader(201)
	rw.Write(js)
	log.Print(u.Email + " created task " + params.Name + " in list " + (*u).Lists[id].Name)
}

func HandleGettingTasks(rw http.ResponseWriter, r *http.Request, u *User) {
	id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	list, ok := (*u).Lists[id]
	if !ok {
		helpers.HandleError(errors.New("specified list does not exist"), rw, 422)
	}

	tasks := make([]Task, 0, len(list.Tasks))
	for _, task := range list.Tasks {
		tasks = append(
			tasks,
			task,
		)
	}

	js, err := json.Marshal(tasks)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}
	rw.WriteHeader(200)
	rw.Write(js)
	log.Print(u.Email + " get his/her tasks for " + list.Name)
}

func HandleUpdatingTask(rw http.ResponseWriter, r *http.Request, u *User) {
	params := &TaskCallParams{}

	if err := json.NewDecoder(r.Body).Decode(params); err != nil {
		helpers.HandleError(errors.New("could not read params"), rw, 400)
		return
	}

	list_id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	task_id, err := strconv.Atoi(mux.Vars(r)["task_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid task index"), rw, 400)
		return
	}
	list, ok := (*u).Lists[list_id]

	if !ok {
		helpers.HandleError(errors.New("no list with this index"), rw, 422)
		return
	}
	task, ok := list.Tasks[task_id]

	if !ok {
		helpers.HandleError(errors.New("no task with this index"), rw, 422)
		return
	}
	log.Print((*u).Email + " updated task " + task.Name + " to " + params.Name + " in list " + list.Name)

	task.Name = params.Name
	task.Description = params.Description
	task.Status = params.Status

	list.Tasks[task_id] = task
	(*u).Lists[list_id] = list

	js, err := json.Marshal(task)
	if err != nil {
		helpers.HandleError(err, rw, 501)
		return
	}
	rw.WriteHeader(201)
	rw.Write(js)
}

func HandleDeletingTask(rw http.ResponseWriter, r *http.Request, u *User) {
	list_id, err := strconv.Atoi(mux.Vars(r)["list_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid list index"), rw, 400)
		return
	}

	task_id, err := strconv.Atoi(mux.Vars(r)["task_id"])

	if err != nil {
		helpers.HandleError(errors.New("invalid task index"), rw, 400)
		return
	}

	list, ok := (*u).Lists[list_id]

	if !ok {
		helpers.HandleError(errors.New("no list with this index"), rw, 422)
		return
	}
	if task, ok := list.Tasks[task_id]; ok {
		log.Print((*u).Email + " deleted task " + task.Name + " in list " + list.Name)
		delete((*u).Lists[list_id].Tasks, task_id)
	} else {
		helpers.HandleError(errors.New("no task with this index"), rw, 400)
		return
	}

	rw.WriteHeader(204)
	rw.Write([]byte(""))
}
