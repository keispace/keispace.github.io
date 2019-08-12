---
layout: post
title: 톰캣 + React + node(express) 프록시 연결 
author: keispace
category: Dev-Web
tags: [tomcat, React, create-react-app, express, Nodejs, proxy, Apache, ReverseProxy]
---

category: Dev-Web  
tags: [tomcat, React, create-react-app, express, Nodejs, proxy, Apache, ReverseProxy]


올해부터 무인 키오스크에서 웹개발로 팀 이동을 했지만 둘다 작업해야하는 몰지각한 상황입니다만..  
사이트 관리? 서버관리? 쪽 이슈라서 간만에 블로깅.

대충 상황을 설명하자면  
기존의 관리자 사이트는 톰캣으로 구동되며  
서버는 Aws 에서 DEV, WAS, WEB 3가지 ec2인스턴스를 사용중인데  
이번에 토이 프로젝트로 만든 브랜드 홍보페이지(react)를 시험삼아 운영에 올려보기로 했다. 

심지어 기존 www sub domain 을 이번 브랜드 페이지로 변경하고 기존 관리자 사이트는 별도의 sub domain으로 변경...


기존의 구조는  
개발:  DEV(apache-tomcat) - DB(oracle)  
운영: WEB(apache)-WAS(tomcat)-DB(oracle)  
인 상태로 apache는 기본적으로 80으로 접속시 8080으로 리버스프록시가 설정되 있는 상태이다(개발,운영 둘다)  

토이 프로젝트 구조는 아래와 같이 node기반 2개의 서버가 돌아간다.  
React - api(express) - DB(oracle)  
개발은 기존의 리버스 프록시에 노드 포트 3000번만 뚫어서 연결했다. 이건 뭐 간단하니까 패스..  
구조는 아래와 같다.  
Dev ip :8080 OR 80 -> 톰캣  
Dev ip :3000 -> create-react-app. webpack dev server  
Dev ip\api\*:3000 -> localhost\api:3001 (express. restfulAPI)

즉 노드와 톰캣을 분리해서 포트별로 접속한다.  


문제는 운영서버.  
이미 프록시로 되어있어서 기존방식대로 연결하면 프론트 사이트는 접속되나 api에 접속하지 못하는 현상이 발생하였다.  
3001 내부 프록시 설정으로 던지는 url을 web서버에서 먼저 잡아버려서 정상적인 호출이 안되는 상황.  
그냥 하위도메인 연결하면 더 간단하긴 한데 이미 각각 루트 도메인으로 개발한 상태이기 때문에(토이를 운영에 붙일거라곤 예상 못함)  
래저래 삽질을 좀 했지만 결론적으로는 아래와 같이 구성.  
(8080 포트로 가는 부분은 이미 운영 중인 부분이라 수정 불가…)

운영 구조(web was 서버는 개별 인스턴스)  
Web 서버 Apache httpd 리버스 프록시  
WAS 8080 톰캣, 5000 브랜드 사이트, 3001 api서버  
-> sub1.domain -> web -> was:8080(톰캣)  
-> www.domain -> web -> was:5000(react-react-app build. Serve로 실행)  
-> www.domain/api/ -> web -> was:3001(express)  


리버스 프록시 설정은 구글링 하면 충분히 나오지만 실질적인 작업부분만 보면 
Httpd.conf 파일의 리버스 프록시 설정 
```
#구글링하면 virtualhost쪽에 주소를 입력하게 되어있는데 내 경우는 퍼미션 오류같은게 난다.  
# www와 sub로 세팅하므로 이렇게 세팅.  
#톰캣 연결   
<VirtualHost *:80>  
\##sub 도메인  
    ServerName sub.domain  
    ProxyRequests Off  
    ProxyPreserveHost On  
    <Proxy *>  
        Require all granted  
    </Proxy>  
    \## /  
    ProxyPass / ip:8080/ retry=1 acquire=3000 timeout=600 Keepalive=Off  
    ProxyPassReverse / ip:8080/  
    <Location />  
        Require all granted  
    </Location>  
</VirtualHost>  
<VirtualHost *:80>  
    ## www도메인   
    ServerName www.domain  
    ProxyRequests Off  
    ProxyPreserveHost On  
    <Proxy *>  
        Require all granted  
    </Proxy>  
    ## api 가는 하위도메인 지정  
    ProxyPass /api/ ip:3001/api/  
    ProxyPassReverse/api/ ip:3001/api/  
    ## react 페이지 연결  
    ProxyPass / ip:5000/  
    ProxyPassReverse / ip:5000/  
    <Location />   
        Require all granted  
    </Location>  
</VirtualHost>  
```

노드쪽 구성은 직접 하고 보니 아래 사이트에 완전히 같은 방식을 설명하고 있다. 참조하자.  
[fullstackreact참조사이트](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)

