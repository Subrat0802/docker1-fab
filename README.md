# Docker Setup Guide

This guide demonstrates how to run MongoDB and Backend containers both manually (step-by-step) and using Docker Compose.

---

## Table of Contents
1. [Manual Setup (Separate Containers)](#manual-setup-separate-containers)
2. [Docker Compose Setup](#docker-compose-setup)
3. [Useful Docker Commands](#useful-docker-commands)

---

## Manual Setup (Separate Containers)

### Step 1: Create Docker Network
**What it does:** Creates a custom bridge network so containers can communicate with each other by name.

```bash
docker network create mongodocketnet-1
```

### Step 2: Create Docker Volume
**What it does:** Creates a named volume to persist MongoDB data even if the container is removed.

```bash
docker volume create docker1-vol
```

### Step 3: Build Backend Image
**What it does:** Builds a Docker image from your Dockerfile and tags it as `docker-1-mongo`.

```bash
docker build -t docker-1-mongo .
```

### Step 4: Run MongoDB Container
**What it does:** Starts MongoDB container with persistent storage, connects it to the network, and exposes port 27017.

```bash
docker run -d \
  --name mongodb \
  -v docker1-vol:/data/db \
  --network mongodocketnet-1 \
  -p 27017:27017 \
  mongo
```

**Flags explained:**
- `-d` - Run in detached mode (background)
- `--name mongodb` - Name the container "mongodb"
- `-v docker1-vol:/data/db` - Mount volume for data persistence
- `--network mongodocketnet-1` - Connect to custom network
- `-p 27017:27017` - Map port 27017 (host:container)
- `mongo` - Use official MongoDB image

### Step 5: Run Backend Container
**What it does:** Starts your backend application, connects it to the same network as MongoDB, and exposes port 3000.

```bash
docker run -p 3000:3000 \
  --network mongodocketnet-1 \
  --name backend \
  docker-1-mongo
```

**Flags explained:**
- `-p 3000:3000` - Map port 3000 (host:container)
- `--network mongodocketnet-1` - Connect to the same network as MongoDB
- `--name backend` - Name the container "backend"
- `docker-1-mongo` - Use the image we built

### Step 6: Verify Containers are Running
**What it does:** Lists all running containers.

```bash
docker ps
```

### Step 7: Check Logs (Optional)
**What it does:** Displays logs from the backend container to verify it's working.

```bash
docker logs backend
```

**Follow logs in real-time:**
```bash
docker logs -f backend
```

---

## Docker Compose Setup

Docker Compose simplifies the entire setup into a single command.

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo 
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
  
  backend:
    build: .  
    container_name: backend_app
    depends_on:
      - mongodb
    ports:
      - "3000:3000"
    environment:
      MONGO_URL: mongodb://mongodb:27017/docker-2

volumes:
  mongodb_data:
```

### Step 1: Start All Services
**What it does:** Builds images (if needed), creates network and volumes automatically, starts all containers defined in docker-compose.yml.

```bash
docker-compose up
```

**Run in background (detached mode):**
```bash
docker-compose up -d
```

**Build and start (force rebuild):**
```bash
docker-compose up --build
```

### Step 2: View Logs
**What it does:** Shows logs from all services.

```bash
docker-compose logs
```

**Follow logs in real-time:**
```bash
docker-compose logs -f
```

**View logs for specific service:**
```bash
docker-compose logs backend
```

### Step 3: Check Running Services
**What it does:** Lists all containers managed by Docker Compose.

```bash
docker-compose ps
```

### Step 4: Stop All Services
**What it does:** Stops all running containers but keeps them and their data.

```bash
docker-compose stop
```

### Step 5: Stop and Remove Containers
**What it does:** Stops and removes all containers, but keeps volumes (data persists).

```bash
docker-compose down
```

**Remove containers and volumes (deletes all data):**
```bash
docker-compose down -v
```

### Step 6: Restart Services
**What it does:** Restarts all services without rebuilding.

```bash
docker-compose restart
```

---

## Useful Docker Commands

### Container Management

**List all containers (running and stopped):**
```bash
docker ps -a
```

**Stop a container:**
```bash
docker stop <container_name>
```

**Remove a container:**
```bash
docker rm <container_name>
```

**Force remove a running container:**
```bash
docker rm -f <container_name>
```

**Start a stopped container:**
```bash
docker start <container_name>
```

**Restart a container:**
```bash
docker restart <container_name>
```

### Image Management

**List all images:**
```bash
docker images
```

**Remove an image:**
```bash
docker rmi <image_name>
```

**Force remove an image:**
```bash
docker rmi -f <image_name>
```

**Pull image from Docker Hub:**
```bash
docker pull <image_name>
```

**Push image to Docker Hub:**
```bash
docker tag <local_image> <username>/<image_name>:tag
docker push <username>/<image_name>:tag
```

### Network Management

**List all networks:**
```bash
docker network ls
```

**Inspect a network:**
```bash
docker network inspect <network_name>
```

**Remove a network:**
```bash
docker network rm <network_name>
```

### Volume Management

**List all volumes:**
```bash
docker volume ls
```

**Inspect a volume:**
```bash
docker volume inspect <volume_name>
```

**Remove a volume:**
```bash
docker volume rm <volume_name>
```

**Remove all unused volumes:**
```bash
docker volume prune
```

### Clean Up Commands

**Remove all stopped containers:**
```bash
docker container prune
```

**Remove all unused images:**
```bash
docker image prune -a
```

**Remove all unused networks:**
```bash
docker network prune
```

**Remove everything (containers, images, volumes, networks):**
```bash
docker system prune -a --volumes
```

---

## Connection Details

- **Backend URL:** http://localhost:3000
- **MongoDB URL (from host):** mongodb://localhost:27017
- **MongoDB URL (from backend container):** mongodb://mongodb:27017/docker-2

---

## Quick Reference

### Manual Setup Summary
```bash
# 1. Create network
docker network create mongodocketnet-1

# 2. Create volume
docker volume create docker1-vol

# 3. Build image
docker build -t docker-1-mongo .

# 4. Run MongoDB
docker run -d --name mongodb -v docker1-vol:/data/db --network mongodocketnet-1 -p 27017:27017 mongo

# 5. Run Backend
docker run -p 3000:3000 --network mongodocketnet-1 --name backend docker-1-mongo

# 6. Check status
docker ps
```

### Docker Compose Summary
```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v
```

---

## Troubleshooting

**Container name already in use:**
```bash
docker rm -f <container_name>
```

**Port already in use:**
```bash
# Find process using the port
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

**Cannot connect to MongoDB:**
- Ensure both containers are on the same network
- Use container name (`mongodb`) not `localhost` in connection string
- Verify MongoDB is running: `docker logs mongodb`

**Permission denied errors:**
```bash
sudo docker <command>
```

---

## Project Structure

```
docker-1/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── index.ts
├── db.ts
├── bun.lock
├── .dockerignore
├── .gitignore
└── README.md
```

---

## Author

Created for learning Docker containerization with Node.js/Bun and MongoDB.