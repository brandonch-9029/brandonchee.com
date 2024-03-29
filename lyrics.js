async function findLyrics() {
    // const response = await fetch("https://brandonlyrics.blob.core.windows.net/lyrics?comp=list");

    await fetch('https://brandonlyrics.blob.core.windows.net/lyrics?restype=container&comp=list&include=metadata')
    .then(response => response.text())
    .then(xmlString => {
        // Parse the XML once you have the XML string
        parseXMLResponse(xmlString);
    })
    .catch(error => console.error('Error fetching XML:', error));

    function parseXMLResponse(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        console.log(xmlDoc); // Raw XML response of Storage Container

        // Find the number of distinct blobs in the container
        const allBlobs = xmlDoc.getElementsByTagName('Blob');

        // Loop through each item in list
        var toAdd = document.createDocumentFragment();
        for (i=0; i < allBlobs.length; i++) {
            var tableRow = document.createDocumentFragment(); // Create Table Row
            //const brk = document.createElement('br');
            const blob = allBlobs[i]; // Current Blob
            blobFileName = blob.childNodes[0].childNodes[0].nodeValue; // File Name
            blobUrl = blob.childNodes[1].childNodes[0].nodeValue; // File URL
            blobName = blobFileName.slice(0, -5) // Remove .html to get song name
            
            blobTitle = blobName; // Song Name
            blobArtist = blob.childNodes[3].getElementsByTagName('Artist')[0].innerHTML; // No idea why it is innerHTML here but the blobs are nodeValue
            blobAlbum = blob.childNodes[3].getElementsByTagName('Album')[0].innerHTML;

            // In case Artist/Album is in Japanese, we will perform URI decoding
            blobArtistDecoded = decodeURI(blobArtist)
            blobAlbumDecoded = decodeURI(blobAlbum)

            var newIndex = document.createElement('th') // Index Element
            var newTitle = document.createElement('td') // Title Element
            var newArtist = document.createElement('td') // Artist Element
            var newAlbum = document.createElement('td') // Album Element
            var newLink = document.createElement('td') // Link Element
            var newHref = document.createElement('a'); // Actual Link

            currentIndex = i + 1 // Count from 1
            newIndex.innerHTML = currentIndex.toString(); // Index to String
            newIndex.scope = "row" // Bootstrap <tr> scope is row

            newTitle.innerHTML = blobTitle; // Assign Metadata
            newArtist.innerHTML = blobArtistDecoded; // Decoded
            newAlbum.innerHTML = blobAlbumDecoded; // Decoded

            newHref.href = blobUrl; // Include blob URL
            newHref.innerHTML = "Link";
            newHref.target = "_blank"; // Target blank to open in new tab
            newLink.appendChild(newHref);
            

            var newRow = document.createElement('tr'); // Create a new row <tr>
            
            newRow.appendChild(newIndex);
            newRow.appendChild(newTitle);
            newRow.appendChild(newArtist);
            newRow.appendChild(newAlbum);
            newRow.appendChild(newLink);

            tableRow.appendChild(newRow); // The completed <tr> element is added into the tableRow var
            //toAdd.appendChild(brk);


            toAdd.appendChild(tableRow); // The finalised <tr> Table Row gets added into the Table
        }

        document.getElementById('linklist').appendChild(toAdd); // The entire group of table rows is added in

        // Step by step of how I derived blobName in 1 line:
        //const example = allBlobs[i] <- This is the list of blobs
        //exampleNameNode = example.childNodes[0];
        //exampleNameTextNode = exampleNameNode.childNodes[0];
        //exampleName = exampleNameTextNode.nodeValue;
        //console.log(exampleName);
    }
}
 