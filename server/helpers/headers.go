package helpers

import "net/http"

func SetHeader(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST,GET,OPTIONS, PUT, DELETE")
	// (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
	(*w).Header().Set("Access-Control-Allow-Headers", "*")

}
