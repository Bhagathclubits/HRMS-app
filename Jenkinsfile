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
                    // Use the 'Username with password' credential for GitHub
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
                        // Extract the username from the credential
                        def githubUsername = env.GITHUB_USERNAME
                        
                        // Retrieve the Docker password securely
                        def dockerCreds = credentials('dockerPass')
                        def dockerPassword = dockerCreds == null ? null : dockerCreds.getSecret()

                        sh "docker login -u $githubUsername -p $dockerPassword docker.io"
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
