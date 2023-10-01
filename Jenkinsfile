pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('dockerPassUsername')
        DOCKER_PASSWORD = credentials('dockerPassPassword')
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
                    sh "docker login -u \$DOCKER_USERNAME -p \$DOCKER_PASSWORD docker.io"
                    sh "docker build -t myimage:latest ."
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                sh "docker pull myimage:latest"
                sh "docker run -d -p 3000:3000 --name mycont myimage:latest"
            }
        }
    }
}
