package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// The gravitational acceleration constant
var g = 9.81

func position(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	V, _ := strconv.ParseFloat(r.URL.Query().Get("V"), 64)
	A, _ := strconv.ParseFloat(r.URL.Query().Get("A"), 64)
	H, _ := strconv.ParseFloat(r.URL.Query().Get("H"), 64)

	// Degrees to Radians
	A *= 3.1415 / 180

	// a, b, c parameters of the parabulla
	a := -g / (2 * V * V * math.Cos(A) * math.Cos(A))
	b := math.Tan(A)
	c := H

	// The quadratic formula
	response := map[string]string{"position": fmt.Sprintf("%f", (-b-math.Sqrt(b*b-4*a*c))/(2*a))}
	json.NewEncoder(w).Encode(response)
}

func velocity(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	V, _ := strconv.ParseFloat(r.URL.Query().Get("V"), 64)
	A, _ := strconv.ParseFloat(r.URL.Query().Get("A"), 64)
	H, _ := strconv.ParseFloat(r.URL.Query().Get("H"), 64)

	// Degrees to Radians
	A *= 3.1415 / 180

	// Calculating the time of flight of the Zvuvon
	timeOfFlight := (V*math.Sin(A) + math.Sqrt((V*math.Sin(A))*(V*math.Sin(A))+2*g*H)) / g

	// Calculating the velocity vectors on the x and y axis at the time of hitting th ground
	vx := V * math.Cos(A)
	vy := V*math.Sin(A) - g*timeOfFlight

	response := map[string]string{"velocity": fmt.Sprintf("%f", math.Sqrt(vx*vx+vy*vy))}
	json.NewEncoder(w).Encode(response)
}

func angle(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	V, _ := strconv.ParseFloat(r.URL.Query().Get("V"), 64)
	A, _ := strconv.ParseFloat(r.URL.Query().Get("A"), 64)
	H, _ := strconv.ParseFloat(r.URL.Query().Get("H"), 64)

	// Degrees to Radians
	A *= 3.1415 / 180

	// a, b, c parameters of the parabulla
	a := -g / (2 * V * V * math.Cos(A) * math.Cos(A))
	b := math.Tan(A)
	c := H

	// The quadratic formula
	finalPos := (-b - math.Sqrt(b*b-4*a*c)) / (2 * a)

	// Calculating the derivetive of the parabulla at x = 0 and turning the slope into an angle with atan
	angle := math.Atan(2*a*finalPos + b)

	response := map[string]string{"angle": fmt.Sprintf("%f", math.Abs(angle)*(180/3.1415))}
	json.NewEncoder(w).Encode(response)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/position", position)
	r.HandleFunc("/velocity", velocity)
	r.HandleFunc("/angle", angle)

	log.Println("Server has started!!!")
	log.Fatal(http.ListenAndServe(":80", r))
}
