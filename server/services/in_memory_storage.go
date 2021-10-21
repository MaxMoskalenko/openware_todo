package services

import (
	"crypto/md5"
	"errors"
	"os"
	"sync"
)

type User struct {
	Email          string
	PasswordDigest string
	Lists          map[int]List
	ListCounter    int
}

type List struct {
	Id          int
	Name        string
	Tasks       map[int]Task
	TaskCounter int
}

type Task struct {
	Id          int
	Name        string
	Description string
	Status      string
}

type UserRepository interface {
	Add(string, User) error
	Get(string) (User, error)
}

type InMemoryUserStorage struct {
	lock    sync.RWMutex
	storage map[string]User
}

func NewInMemoryUserStorage() *InMemoryUserStorage {
	passwordDigest := md5.New().Sum([]byte("12345678"))
	storage := make(map[string]User)
	storage["hello@world.com"] = User{
		Email:          "hello@world.com",
		PasswordDigest: string(passwordDigest),
		Lists: map[int]List{
			0: {
				Id:   0,
				Name: "University",
				Tasks: map[int]Task{
					0: {
						Id:          0,
						Name:        "Top priority",
						Description: "Do not leave the University",
						Status:      "Open",
					},
				},
			},
			3: {
				Id:   3,
				Name: "Work",
				Tasks: map[int]Task{
					0: {
						Id:          0,
						Name:        "Finish OWH exam",
						Description: "Write api and do some landing",
						Status:      "Open",
					},
					2: {
						Id:          2,
						Name:        "DO MORE TESTS FOR THE GOD OF TESTS",
						Description: "...",
						Status:      "Open",
					},
				},
			},
		},
	}
	return &InMemoryUserStorage{
		lock:    sync.RWMutex{},
		storage: storage,
	}
}

func (userStorage InMemoryUserStorage) Add(key string, u User) error {
	_, ok := userStorage.storage[key]
	if ok || u.Email == os.Getenv("CAKE_ADMIN_EMAIL") {
		err := errors.New("this user is already exists")
		return err
	}
	userStorage.storage[key] = u
	return nil
}

func (userStorage InMemoryUserStorage) Get(key string) (User, error) {
	if u, ok := userStorage.storage[key]; ok {
		return u, nil
	}
	err := errors.New("there is no such user")
	empty := User{}
	return empty, err
}
