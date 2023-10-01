pipeline {
    agent any
    environment {
        DOCKER_IMAGE_TAG = 'myimage:latest' // Specify your custom Docker image name and tag here
        CONTAINER_NAME = 'mycont' // Specify your container name here
    }
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: []])
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerCreds = credentials('dockerPass') // Use the Docker Hub credentials ID
                    withCredentials([string(credentialsId: 'github', variable: 'GITHUB_CREDENTIALS')]) {
                        sh "docker login -u ${dockerCreds.getUsername()} -p ${dockerCreds.getPassword()} docker.io"
                        sh "docker build -t $DOCKER_IMAGE_TAG ."
                    }
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                sh "docker pull $DOCKER_IMAGE_TAG" // Pull the Docker image
                sh "docker run -d -p 3000:3000 --name $CONTAINER_NAME $DOCKER_IMAGE_TAG" // Run the Docker container with the specified container name
            }
        }
    }
}

