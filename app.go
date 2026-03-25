package main

import (
	"context"
	"io"
	"net/http"
	"strconv"
)

// App struct
type App struct {
	ctx   context.Context
	Count int
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Tally() int {
	resp, err := (http.Get("http://localhost:5050/tally")) // 192.168.1.106
	if err != nil {
		return 0
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0
	}

	i, err := strconv.Atoi(string(body))
	if err != nil {
		return 0
	}

	return i
}
