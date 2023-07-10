require("stream");
require("string_decoder");
const { Parser, NamedNode } = require("n3");

/* save data for rdf generation */
let rdfData = () => {
   /* click on submit buttons */
   var submits = document.querySelectorAll(".submit-triple");
   submits.forEach((submit) => {
      submit.addEventListener("click", () => {

         /* triple values */
         var subject = submit.getAttribute("data-subject");
         var predicateSelect = document.querySelector(".select-predicate");
         var objects = submit.getAttribute("data-object").split("___");

         var subjectBibl = submit.getAttribute("data-bibl-subject");
         var objectBibl = submit.getAttribute("data-bibl-object");

         /* triple rdf components */
         var rdfSubject = document.querySelector("[data-type='triple'][data-role='subject']");
         var rdfPredicate = document.querySelector("[data-type='triple'][data-role='predicate']");
         var rdfObject = document.querySelector("[data-type='triple'][data-role='object']");

         /* subject */
         if (subject !== null) {
            rdfSubject.innerHTML = "&#x3c;" + subject + "&#x3e;";
         } else {
            rdfSubject.innerHTML = "";
         };

         /* predicate */
         var predicate = predicateSelect.options[predicateSelect.selectedIndex].text;
         var prefix = predicateSelect.options[predicateSelect.selectedIndex].getAttribute("data-prefix");
         rdfPredicate.innerHTML = prefix + predicate;

         /* object */
         if (objects.length > 1) {
            rdfObject.innerHTML = "";
            objects.forEach((object) => {
               rdfObject.innerHTML += "<p>" + "<span class='object-comp'>" + "&#x3c;" + "<span class='object-uri'>" + object + "</span>" + "&#x3e;" + "</span>" + "<span class='object-punct'></span>" + "</p>";
            });
         } else if (objects.length = 1) {
            rdfObject.innerHTML = "";
            objects.forEach((object) => {
               if (object == "") {
                  rdfObject.innerHTML = "";
               } else {
                  rdfObject.innerHTML += "<p>" + "<span class='object-comp'>" + "&#x3c;" + "<span class='object-uri'>" + object + "</span>" + "&#x3e;" + "</span>" + "<span class='object-punct'></span>" + "</p>";
               };
            });
         };

         /* NOTE */
         var note = document.querySelector(".scholarly-note").value;
         var rdfPredicateNote = document.querySelector("[data-type='triple'][data-role='predicate-note']");
         var rdfObjectNote = document.querySelector("[data-type='triple'][data-role='object-note']");
         if (note !== "") {
            rdfPredicateNote.innerHTML = "ecrm:P3_has_note";
            rdfObjectNote.innerHTML = "<p>" + '"' + note + '"' + "<span class='object-punct'></span>" + "</p>";
         } else {
            rdfPredicateNote.innerHTML = "";
            rdfObjectNote.innerHTML = "";
         };

         /* PUNCTUATION */
         var objsToDivide = document.querySelectorAll("[data-punctuation='check'] p");
         var objsToDivideLen = objsToDivide.length - 1;
         var lastObj = objsToDivide[objsToDivideLen];

         objsToDivide.forEach((obj) => {
            var objPunct = obj.querySelector(".object-punct");

            /* NOTE */
            if (obj.parentNode.getAttribute("data-role") == "object-note") {
               objPunct.innerHTML = " .";
            } else {
               /* OTHER OBJECTS */
               /* if more than one object */
               /* if the next element sibling is empty */
               /* add ; to all the objects except the last that is assigned with . */
               if (obj.parentNode.nextElementSibling.innerHTML == "") {
                  if (obj.parentNode.children.length > 1) {
                     objPunct.innerHTML = "";
                     objPunct.innerHTML = " ;";
                     lastObj.querySelector(".object-punct").innerHTML = "";
                     lastObj.querySelector(".object-punct").innerHTML = " .";
                  } else {
                     objPunct.innerHTML = "";
                     objPunct.innerHTML = " .";
                  };
               } else {
                  /* if the next element sibling is not empty */
                  /* add ; to all the objects */
                  objPunct.innerHTML = "";
                  objPunct.innerHTML = " ;";
               };
            };
         });

         /* URI / RDF LABEL */
         /* subject */
         var subjectUri = document.querySelector("[data-role='subject-rdf-label']");
         var htmlObject = document.createElement("div");
         htmlObject.innerHTML = subjectBibl;
         subjectBibl = htmlObject.textContent;
         subjectUri.innerHTML = "&#x3c;" + subject + "&#x3e;" + " rdfs:label " + '"' + subjectBibl + '"' + " .";

         /* object */
         var objectUri = document.querySelector("[data-role='object-rdf-label']");

         /* TRYING */
         /* object dict */
         var objectsDict = [];
         objects.forEach((obj) => {
            objectsDict.push({
               join: obj
            });
         });

         /* bibl object dict */
         var objectBiblDict = [];
         objectBibl.split("___").forEach((bibl) => {
            var htmlObject = document.createElement("div");
            htmlObject.innerHTML = bibl;
            bibl = htmlObject.textContent;
            objectBiblDict.push({
               join: bibl
            });
         });

         /* combined dict */
         var combined = [];
         for (var i = 0; i < objectsDict.length; i++) {
            combined[i] = { uri: objectsDict[i].join, bibl: objectBiblDict[i].join };
         };

         /* print rdf */
         objectUri.innerHTML = "";

         for (var i = 0; i < combined.length; i++) {
            objectUri.innerHTML += "&#x3c;" + combined[i]["uri"] + "&#x3e;" + " rdfs:label " + '"' + combined[i]["bibl"] + '"' + " .";
         };
         /* / */

         /* NATURAL LANGUAGE */
         /* show natural language res */
         var rdfTriple = document.querySelector(".res-triple").textContent.trim();

         /*
            Author: Andrea Schimmenti
            Copyright (c) 2023 by the author
         */

         async function parseRdfGraph(rdfGraph) {
            const parser = new Parser();
            const graphStrings = [];

            await new Promise((resolve, reject) => {
               parser.parse(rdfGraph, (error, quad) => {
                  if (error) {
                     reject(error);
                  } else if (quad) {
                     graphStrings.push({
                        Subject: quad.subject.value,
                        Predicate: quad.predicate.value,
                        Object: quad.object.value,
                        Graph: quad.graph.value
                     });
                  } else {
                     resolve();
                  }
               });
            });
            return graphStrings;
         }

         // RDF graph in Cidoc-CRM
         const rdfGraph = rdfTriple;

         // Store the result in a variable for later use
         let parsedGraph;

         // Call the async function and store the result
         parseRdfGraph(rdfGraph)
            .then(graphStrings => {
               parsedGraph = graphStrings;
               let text = findTemplates(parsedGraph);

               /* print in the natural language section */
               var naturalLangRes = document.querySelector(".res-natural-lang p");
               naturalLangRes.innerHTML = "";
               naturalLangRes.innerHTML = text;
            })
            .catch(error => {
               console.error('Error parsing RDF graph:', error);
            });

         const labelDict = {}; // Dictionary to store URI-label mappings

         function findTemplates(arr) {
            let convertedText = '';
            arr.forEach(graph => {
               if (graph.Predicate === 'http://www.w3.org/2000/01/rdf-schema#label') {
                  // Add URI-label mapping to the dictionary
                  labelDict[graph.Subject] = graph.Object;
               }
            });

            arr.forEach(graph => {
               if (graph.Predicate in ecrmTemplates) {
                  const template = ecrmTemplates[graph.Predicate];
                  const objectLabel = labelDict[graph.Object] || graph.Object; // Use label if available, otherwise use the URI
                  const subjectLabel = labelDict[graph.Subject] || graph.Subject; // Use label if available, otherwise use the URI
                  convertedText += template.replace("{Subject}", subjectLabel).replace("{Object}", objectLabel);
                  convertedText += ' ';
               }
            });

            return convertedText;
         };

         const ecrmTemplates = {
            "http://erlangen-crm.org/current/P15_was_influenced_by": "{Subject} was influenced by {Object}.",
            "http://erlangen-crm.org/current/P3_has_note": "{Subject}'s has the following note: {Object}"
         };

         /* block/unblock save/confirm/cancel button */
         var saveBtn = document.querySelector(".submit-triple");
         var confirmBtn = document.querySelector(".btn-confirm");
         var cancelBtn = document.querySelector(".btn-cancel");
         confirmBtn.removeAttribute("disabled");
         cancelBtn.removeAttribute("disabled");
         saveBtn.setAttribute("disabled", "disabled");
      });
   });
};

module.exports = rdfData();