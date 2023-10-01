pipeline {
    agent any

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
                        withCredentials([secretText(credentialsId: 'dockerPass', secretVariable: 'DOCKER_PASSWORD')]) {
                            def dockerPassword = DOCKER_PASSWORD

                            sh "docker login -u $githubUsername -p $dockerPassword docker.io"
                            sh "docker build -t myimage:latest ."
                        }
                    }
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                withCredentials([secretText(credentialsId: 'dockerPass', secretVariable: 'DOCKER_PASSWORD')]) {
                    def dockerPassword = DOCKER_PASSWORD

                    sh "docker login -u dockadministrator -p $dockerPassword"
                    sh "docker pull myimage:latest"
                    sh "docker run -d -p 3000:3000 --name mycont myimage:latest"
                }
            }
        }
    }
}
