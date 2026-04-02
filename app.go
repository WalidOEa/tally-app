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

// Increment tally
func (a *App) Increment() int {
	return a.fetchBody("/increment")
}

// Decrement tally
func (a *App) Decrement() int {
	return a.fetchBody("/decrement")
}

// Fetch initial tally during wakeup
func (a *App) GetInitialCount() int {
	return a.fetchBody("/curr")
}

// Get current limit as held by db
func (a *App) GetLimit() int {
	url := "http://localhost:5050/limit/curr"

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error in fetching limit from API", "error", err)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error("Error in reading response body", "error", err)
	}

	i, err := strconv.Atoi(string(body))
	if err != nil {
		slog.Error("Error in casting string to int", "error", err)
	}

	slog.Info("Returning int cast response body", "i", i)
	return i
}

// Send limit to API
func (a *App) SetLimit(limit int) {
	url := fmt.Sprintf("http://localhost:5050/limit?value=%d", limit)

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error in sending limit to API", "error", err)
	}

	defer resp.Body.Close()

	slog.Info("Successfully sent limit to API")
}

// Fetch response body from specified IP
func (a *App) fetchBody(endpoint string) int {
	url := fmt.Sprintf("http://localhost:5050%s", endpoint) // 192.168.1.106

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error in fetching response", "error", err)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error("Error in reading response body", "error", err)
	}

	i, err := strconv.Atoi(string(body))
	if err != nil {
		slog.Error("Error in casting string to int", "error", err)
	}

	slog.Info("Returning int cast response body", "i", i)
	return i
}
