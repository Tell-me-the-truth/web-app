require("stream");
require("string_decoder");
const { Parser, NamedNode } = require("n3");

module.exports = function () {

   /*
      Author: Andrea Schimmenti
      Copyright (c) 2023 by the author
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted, provided that the above
      copyright notice and this permission notice appear in all copies.
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
      WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
      MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
      SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
      WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
      OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
      CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   */

   const { Parser, NamedNode } = require('n3');

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
   const rdfGraph = `
    @prefix ecrm: <http://erlangen-crm.org/current/> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    <https://w3id.org/giuseppe-raimondi-lod/pub-text/mostro-a-due-teste-1971>
    ecrm:P15_was_influenced_by
    <https://w3id.org/giuseppe-raimondi-lod/pub-text/monsieur-teste-1927> ;
    ecrm:P3_has_note
    "test nota" .

    <https://w3id.org/giuseppe-raimondi-lod/pub-text/mostro-a-due-teste-1971> rdfs:label "Giuseppe Raimondi, Mostro a due teste, 1971" .
    <https://w3id.org/giuseppe-raimondi-lod/pub-text/monsieur-teste-1927> rdfs:label "Paul Valéry, Monsieur Teste, 1927" .

`;

   // Store the result in a variable for later use
   let parsedGraph;

   // Call the async function and store the result
   parseRdfGraph(rdfGraph)
      .then(graphStrings => {
         console.log('Parsing complete!');
         parsedGraph = graphStrings;
         console.log(parsedGraph);
         let text = findTemplates(parsedGraph);
         console.log(text);
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
};