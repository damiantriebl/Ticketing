# Installing tickecting microservices

For installing all the systen you need docker, kubernets and skaffold. If you have docker desktop only need habilitate the kubernets in configurations. 
for skaffold you need https://skaffold.dev/

when you install all the tools, you need to change the host file .
in windows you need to change host located in 

    c:\Windows\System32\Drivers\etc\hosts

put in the file

    127.0.0.1 ticketing.dev/
   this is important, you need to change this for point to endpoint on kubernets.
 one all configurated. you can use:
 

    skaffold dev
   with this you start a server with autoupdate. 
if you like test, you can use inside the auth folder.

    npm run test