pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: []])
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Retrieve the Docker password securely
                    def dockerPassword = credentials('dockerPass')

                    // Build the Docker image based on your Dockerfile
                    sh "docker build -t myimage:latest -f Dockerfile ."

                    // Log in to the Docker registry (docker.io)
                    sh(script: "docker login -u dockadministrator -p ${dockerPassword} docker.io", returnStatus: true)

                    // Push the Docker image to the registry
                    sh "docker push myimage:latest"
                }
            }
        }

        stage('Deploy to Docker Host') {
            steps {
                script {
                    // Retrieve the Docker password securely
                    def dockerPassword = credentials('dockerPass')

                    // Log in to the Docker registry (docker.io)
                    sh(script: "docker login -u dockadministrator -p ${dockerPassword} docker.io", returnStatus: true)

                    // Pull the Docker image from the registry
                    sh "docker pull myimage:latest"

                    // Run a container based on the pulled image
                    sh "docker run -d -p 3000:3000 --name mycont myimage:latest"
                }
            }
        }
    }
}
