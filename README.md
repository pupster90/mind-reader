# mind-reader

# Run Docker
use the command below to launch a docker conatiner with the mind-reader code, as described in the docker hub tutorial. 
tutorial: https://hub.docker.com/repository/docker/pupster90/mindreader

`docker run -it -p 8880:8080 -p 8881:8000 -p 80:8888 -v /your/local/path/mind-reader:/root/Documents/ --name mindreader pupster90/mindreader /bin/bash`

Once inside the dockker container, you can run the different commands below to launch App engine or jupyter

# Run App Engine
App engine reference: https://cloud.google.com/appengine/docs/standard/python3/testing-and-deploying-your-app

`cd /root/Documents/website/freunds-mind-reader`

`dev_appserver.py --host=0.0.0.0  app.yaml`

go to: localhost:8880
note: you may have to remove "--host=0.0.0.0" to get this working locally

# Run Jupyter notebook

`cd /root/Documents/Data_Analysis`

`jupyter notebook`

go to `localhost` to see jupyter. Type password: `yoavfreund`

# R Code
There's R code that was used to analyze the data. Email Matthew Elliott if you want to see/use it.
email: melliot1@ucsc.edu
