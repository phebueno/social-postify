import { Publication } from "@prisma/client";

export function getPublicationByPublishedStatus(publications: Publication[], published: string, after: string){
    let filteredPubs = publications;
    const afterDate = new Date(after);
    if(published==="true"){
        filteredPubs = filteredPubs.filter(publication => publication.date <= new Date(Date.now()));
    } else if(published==="false"){
        filteredPubs = filteredPubs.filter(publication => publication.date >= new Date(Date.now()));
    }    
   
    if(afterDate.toString() !== 'Invalid Date'){
        filteredPubs = filteredPubs.filter(publication => publication.date >= afterDate);
    }

    return filteredPubs;
}

export function checkIfPublished(publication){

}