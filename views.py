from flask import Blueprint, render_template
from rdflib import Graph
from SPARQLWrapper import SPARQLWrapper, JSON
import uuid

""" blueprint """
views = Blueprint(__name__, "views")

""" endpoint """
endpoint = "http://192.168.1.134:9999/blazegraph/sparql"
sparql = SPARQLWrapper(endpoint)

""" query """
""" raimondi """
raimondiWorksquery = """
    PREFIX ecrm: <http://erlangen-crm.org/current/>
    PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/>
    PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
    PREFIX pro: <http://purl.org/spar/pro/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?text ?title ?pubdate ?author ?creation
    WHERE {
    
        ?text a efrbroo:F24_Publication_Expression ;
            ecrm:P102_has_title ?title_uri ;
            prism:publicationDate ?pubdate .
        
        ?rit a pro:RoleInTime ;
            pro:relatesToEntity ?text .
    
        ?author_uri pro:holdsRoleInTime ?rit ;
                    rdfs:label ?author . FILTER (?author="Giuseppe Raimondi"^^xsd:string)
    
        ?title_uri rdf:value ?title .
    
        ?creation efrbroo:R17_created ?text .
        
    }
"""

raimondiInfluencingquery = """
    PREFIX ecrm: <http://erlangen-crm.org/current/>
    PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/>
    PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
    PREFIX pro: <http://purl.org/spar/pro/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?text ?title ?pubdate ?author
    WHERE {
    
        ?text a efrbroo:F24_Publication_Expression ;
            ecrm:P102_has_title ?title_uri ;
            prism:publicationDate ?pubdate .
        
        ?rit a pro:RoleInTime ;
            pro:relatesToEntity ?text .
    
        ?author_uri pro:holdsRoleInTime ?rit ;
                    rdfs:label ?author . FILTER (!regex(?author, "Giuseppe Raimondi","i")) . 
        ?title_uri rdf:value ?title .       
    }
"""

""" homepage """
@views.route("/")
def index():
    return render_template("index.html")

""" raimondi """
@views.route("/raimondi")
def raimondi():
    
    """ works by raimondi """
    """ convert data into JSON """
    sparql = SPARQLWrapper(endpoint)
    sparql.setTimeout(55)
    sparql.setQuery(raimondiWorksquery)
    sparql.setReturnFormat(JSON)
    raimondiResults =  sparql.query().convert()

    """ create a dictionary """
    raimondiAuthors = []
    raimondiWorksDict = {}

    """ authors """
    for result in raimondiResults["results"]["bindings"]:
        if result["author"]["value"] not in raimondiAuthors:
            raimondiAuthors.append(result["author"]["value"])
        
    """ works """
    for author in raimondiAuthors:
        authorWorks = []
        for result in raimondiResults["results"]["bindings"]:
            uuidID = uuid.uuid4()
            id = str(uuidID)
            if author == result["author"]["value"]:
                if id + "---" + result["title"]["value"] + "___" + result["pubdate"]["value"] not in authorWorks:
                    authorWorks.append(id + "---" + result["title"]["value"] + "___" + result["pubdate"]["value"])
                raimondiWorksDict[author] = authorWorks

    """ works influencing raimondi """
    """ convert data into JSON """
    sparql.setQuery(raimondiInfluencingquery)
    sparql.setReturnFormat(JSON)
    inflRaimondiResults =  sparql.query().convert()

    """ create a dictionary """
    inflRaimondiAuthors = []
    inflRaimondiWorksDict = {}

    """ authors """
    for result in inflRaimondiResults["results"]["bindings"]:
        if result["author"]["value"] not in inflRaimondiAuthors:
            inflRaimondiAuthors.append(result["author"]["value"])

    """ works """
    for author in inflRaimondiAuthors:
        authorWorks = []
        for result in inflRaimondiResults["results"]["bindings"]:
            if author == result["author"]["value"]:
                if result["title"]["value"] + "___" + result["pubdate"]["value"] not in authorWorks:
                    authorWorks.append(result["title"]["value"] + "___" + result["pubdate"]["value"])
                inflRaimondiWorksDict[author] = authorWorks

    return render_template("raimondi.html", raimondiAuthors = raimondiAuthors, raimondiWorksDict = raimondiWorksDict, inflRaimondiDict = inflRaimondiWorksDict)