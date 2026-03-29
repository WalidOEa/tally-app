package main

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
)

// App struct
type App struct {
	ctx context.Context
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

func (a *App) Increment() int {
	return a.fetchBody("/increment")
}

func (a *App) Decrement() int {
	return a.fetchBody("/decrement")
}

func (a *App) GetInitialCount() int {
	return a.fetchBody("/curr")
}

func (a *App) GetLimit() int {
	url := "http://localhost:5050/limit/curr"

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error", "Failed to get limit", err)
		return 0
	}
	defer resp.Body.Close()

	slog.Info("Success", "Successfully get limit", resp)

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

// Send limit to API
func (a *App) SetLimit(limit int) {
	url := fmt.Sprintf("http://localhost:5050/limit?value=%d", limit)

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error", "Failed to set limit", err)
		return
	}
	defer resp.Body.Close()

	slog.Info("Success", "Successfully set limit", resp)
}

func (a *App) fetchBody(endpoint string) int {
	url := fmt.Sprintf("http://localhost:5050%s", endpoint) // 192.168.1.106

	resp, err := (http.Get(url))
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
