package helpers

import (
	"errors"
	"regexp"
)

func ValidateEmail(email string) error {
	match, _ := regexp.MatchString("^[^ ]+@[^ ]+[.][^ ]+$", email)
	if !match {
		err := errors.New("email is not valid")
		return err
	}
	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 {
		err := errors.New("password too short (at least 8 symbols)")
		return err
	}
	return nil
}
