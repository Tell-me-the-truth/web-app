require("stream");
require("string_decoder");
const { Parser, NamedNode } = require("n3");

module.exports = function () {
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

   const rdfGraph = `
        @prefix ecrm: <http://erlangen-crm.org/current/> .
    
        <https://w3id.org/giuseppe-raimondi-lod/pub-text/mostro-a-due-teste-1971>
        ecrm:P15_was_influenced_by
        <https://w3id.org/giuseppe-raimondi-lod/pub-text/monsieur-teste-1927> ;
        ecrm:P3_has_note
        "test nota" .
    `;

   let parsedGraph;

   parseRdfGraph(rdfGraph)
      .then(graphStrings => {
         console.log('Parsing complete!');
         parsedGraph = graphStrings;
         console.log(parsedGraph)
         let text = findTemplates(parsedGraph);
         console.log(text)
      })
      .catch(error => {
         console.error('Error parsing RDF graph:', error);
      });

   const ecrmTemplates = {
      "http://erlangen-crm.org/current/P15_was_influenced_by": "The resource was influenced by {Object}.",
      "http://erlangen-crm.org/current/P3_has_note": "Note: {Object}"
   };

   function findTemplates(arr) {
      let convertedText = ''
      arr.forEach(graph => {
         if (graph.Predicate in ecrmTemplates) {
            template = ecrmTemplates[graph.Predicate]
            convertedText += template.replace("{Object}", graph.Object);
            convertedText += ' '
         }
      });
      return convertedText
   };
};