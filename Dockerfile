FROM node:8.10.0-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# RUN apt-get update && \
#     apt-get -y install apt-transport-https \
#     ca-certificates \
#     curl \
#     gnupg2 \
#     software-properties-common && \
#     curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
#     add-apt-repository \
#     "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
#     $(lsb_release -cs) \
#     stable" && \
#     apt-get update && \
#     apt-get -y install docker-ce
    # https://getintodevops.com/blog/the-simple-way-to-run-docker-in-docker-for-ci

# Set timezone 
# ENV TZ=Asia/Bangkok 
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set localhost 
# RUN echo '127.0.0.1   localhost localhost.localdomain' >> /etc/hosts

EXPOSE 5001

CMD [ "npm" ,"start" ]
