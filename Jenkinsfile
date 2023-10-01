pipeline {
    agent any
    environment {
        DOCKER_IMAGE_TAG = 'myimage:latest'
        CONTAINER_NAME = 'mycont'
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
                    // Use the 'Secret text' credential for GitHub
                    withCredentials([string(credentialsId: 'github', variable: 'GITHUB_CREDENTIALS')]) {
                        // Login to Docker with the 'dockerPass' credential
                        def dockerCreds = credentials('dockerPass')

                        sh "docker login -u ${dockerCreds.getUsername()} -p ${dockerCreds.getPassword()} docker.io"
                        sh "docker build -t $DOCKER_IMAGE_TAG ."
                    }
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                sh "docker pull $DOCKER_IMAGE_TAG"
                sh "docker run -d -p 3000:3000 --name $CONTAINER_NAME $DOCKER_IMAGE_TAG"
            }
        }
    }
}
