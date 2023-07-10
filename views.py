from flask import Blueprint, render_template
from SPARQLWrapper import SPARQLWrapper, JSON
import uuid

""" blueprint """
views = Blueprint(__name__, "views")

""" endpoint """
endpoint = "http://10.60.32.57:9999/blazegraph/sparql"
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
        
    } order by asc(UCASE(str(?author))) limit 50
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
    } order by asc(UCASE(str(?author))) limit 50
"""

""" repim """
repimWorks = """ 
    PREFIX dcterm: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX repim: <http://repim.unibo.it/sm/>
    PREFIX crm: <http://erlangen-crm.org/current/>
    PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
    #?con = WorkConception ?work ?title ?pubdate ?author 
    select * {
        ?con <http://erlangen-crm.org/current/P94_has_created>	?work.
        ?work rdfs:label ?title.
        ?con <http://erlangen-crm.org/current/P14_carried_out_by>/rdfs:label ?author.
        ?con <http://erlangen-crm.org/current/P4_has_time-span>/<http://erlangen-crm.org/current/P78_is_identified_by>/rdfs:label ?date.
    } order by asc(UCASE(str(?author))) limit 50
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

    """ original author works dict """
    authorDict = {}
    for result in raimondiResults["results"]["bindings"]:
        uuidID = uuid.uuid4()
        id = str(uuidID)
        authorDict[result["creation"]["value"]] = {"id": id, "title": result["title"]["value"], "pubdate": result["pubdate"]["value"], "author": result["author"]["value"]}

    """ influencing authors works """
    """ convert data into JSON """
    sparql.setQuery(raimondiInfluencingquery)
    sparql.setReturnFormat(JSON)
    influencersResults =  sparql.query().convert()

    """ influencing authors works dict """
    influencersDict = {}
    for result in influencersResults["results"]["bindings"]:
        uuidID = uuid.uuid4()
        id = str(uuidID)
        influencersDict[result["text"]["value"]] = {"id": id, "title": result["title"]["value"], "pubdate": result["pubdate"]["value"], "author": result["author"]["value"]}

    return render_template("raimondi.html", authorDict = authorDict, influencersDict = influencersDict)

""" repim """
@views.route("/repim")
def repim():
    """ repim works """
    """ convert data into JSON """
    sparql = SPARQLWrapper(endpoint)
    sparql.setTimeout(55)
    sparql.setQuery(repimWorks)
    sparql.setReturnFormat(JSON)
    repimResults =  sparql.query().convert()

    """ repim works dict """
    authorDict = {}
    for result in repimResults["results"]["bindings"]:
        uuidID = uuid.uuid4()
        id = str(uuidID)
        authorDict[result["work"]["value"]] = {"id": id, "title": result["title"]["value"], "pubdate": result["date"]["value"], "author": result["author"]["value"]}

    return render_template("repim.html", authorDict = authorDict)