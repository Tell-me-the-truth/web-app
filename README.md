# Tell me the truth

**Tell me the truth** is a [Python 3](https://www.python.org/downloads/) web application built in [Flask](https://flask.palletsprojects.com/en/2.3.x/). 
The project is ongoing and under development.

## Quick start

Clone this repository using the URL https://github.com/Tell-me-the-truth/web-app.git
or download the folder.

The project works with this **requirement**:

- [**Python**](https://www.python.org/downloads/) v3.6.3

Packages can be installed by running **setup.sh**:
```
sh setup.sh
```

After installing the required packages, install [**Blazegraph**](https://blazegraph.com/) locally:

- Download [**blazegraph.jar**](https://github.com/blazegraph/database/releases/tag/BLAZEGRAPH_2_1_6_RC)
- Create a new **folder** and rename it **data**
- Put **blazegraph.jar in data** folder
- From the terminal enter data and **run blazegraph.jar**:
```
cd data
java -server -Xmx4g -jar blazegraph.jar
```

Finally run the application:
- Run **app.py**
```
python3 app.py
```
- Open the application in your browser: **http://localhost:8000/**
