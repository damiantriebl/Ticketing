# ticketing

projects of ticketing on microservices. follow the course of udemy

[Udemy](https://cognizant.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19102674#questions)

## Installation

you need to install previusly, npm, heml, kubectl y skaffold.

open the folder auth to install node modules. 

`npm install`

install for local ingress-nginx

`helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace`

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/cloud/deploy.yaml`

### Pre-flight check

`kubectl get pods --namespace=ingress-nginx`

if ok, you can use 

`skaffold dev`


