package main

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"time"
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
	go a.keepAlive(ctx)
}

func (a *App) Ping() bool {
	return a.ping()
}

func (a *App) ping() bool {
	maxRetries := 5
	delay := time.Second

	for i := range maxRetries {
		start := time.Now()
		resp, err := http.Get("http://localhost:5050/ping")

		if err == nil {
			resp.Body.Close()
			latency := time.Since(start)

			slog.Info("Ping", "latency", latency)

			return true
		}

		slog.Warn("Server not reachable, trying again", "attempt", i+1, "delay", delay)

		time.Sleep(delay)
		delay *= 2
	}

	slog.Error("Server unreachable after maximum retires", "retries", maxRetries)
	return false
}

func (a *App) keepAlive(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		start := time.Now()

		select {
		case <-ticker.C:
			resp, err := http.Get("http://localhost:5050/ping")
			if err != nil {
				slog.Warn("Ping failed", "error", err)

			} else {
				latency := time.Since(start)
				resp.Body.Close()

				slog.Info("Ping", "latency", latency)
			}
		case <-ctx.Done():
			slog.Info("Keep-alive stopped")
			return
		}
	}
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
		return -1
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error("Error in reading response body", "error", err)
		return -1
	}

	i, err := strconv.Atoi(string(body))
	if err != nil {
		slog.Error("Error in casting string to int", "error", err)
		return -1
	}

	slog.Info("Returning int cast response body", "i", i)
	return i
}

// Send limit to API
func (a *App) SetLimit(limit int) int {
	url := fmt.Sprintf("http://localhost:5050/limit?value=%d", limit)

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error in sending limit to API", "error", err)
		return -1
	}

	defer resp.Body.Close()

	slog.Info("Successfully sent limit to API")
	return 1 // Send this and do some front end shizzz
}

// Fetch response body from specified IP
func (a *App) fetchBody(endpoint string) int {
	url := fmt.Sprintf("http://localhost:5050%s", endpoint) // 192.168.1.106

	resp, err := (http.Get(url))
	if err != nil {
		slog.Error("Error in fetching response", "error", err)
		return -1
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error("Error in reading response body", "error", err)
		return -1
	}

	i, err := strconv.Atoi(string(body))
	if err != nil {
		slog.Error("Error in casting string to int", "error", err)
		return -1
	}

	slog.Info("Returning int cast response body", "i", i)
	return i
}
