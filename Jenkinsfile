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
                        def dockerPassword = sh(script: 'echo \$DOCKER_PASSWORD', returnStdout: true).trim()

                        // Use 'docker login' with --password-stdin
                        sh "echo $dockerPassword | docker login -u $githubUsername --password-stdin docker.io"
                        sh "docker build -t myimage:latest ."
                    }
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                script {
                    // Retrieve the Docker password securely
                    def dockerPassword = sh(script: 'echo \$DOCKER_PASSWORD', returnStdout: true).trim()

                    // Use 'docker login' with --password-stdin
                    sh "echo $dockerPassword | docker login -u dockadministrator --password-stdin docker.io"
                    sh "docker pull myimage:latest"
                    sh "docker run -d -p 3000:3000 --name mycont myimage:latest"
                }
            }
        }
    }
}

