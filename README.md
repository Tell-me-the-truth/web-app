# Tell me the truth

**Tell me the truth** is a [Python 3](https://www.python.org/downloads/) web application built in [Flask](https://flask.palletsprojects.com/en/2.3.x/). 
The project is ongoing and under development.

## Quick start

Clone this repository using the URL https://github.com/Tell-me-the-truth/web-app.git
or download the folder.

The project works with this **requirement**:

- [**Python**](https://www.python.org/downloads/) v3.6.3

Packages can be installed by running **setup.sh**.

After installing the required packages:

- Download **blazegraph.jar** to set the database: https://github.com/blazegraph/database/releases/tag/BLAZEGRAPH_2_1_6_RC
- Run it locally:
```
java -server -Xmx4g -jar blazegraph.jar
```
- Upload your data following the [**Blazegraph Quick Start**]([https://www.python.org/downloads/](https://github.com/blazegraph/database/wiki/Quick_Start))
- Open the application in your browser: **http://localhost:8000/**
