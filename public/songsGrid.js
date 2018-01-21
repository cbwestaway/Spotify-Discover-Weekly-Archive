
		function buildSongsGrid(tracks)
		{
			var gridHTML = '';
      gridHTML += '<thead>';
         gridHTML += '<tr>';
			       gridHTML += '<th></th>';
			       gridHTML += '<th>Song</th>';
			       gridHTML += '<th>Album</th>';
			       gridHTML += '<th>Artist</th>';
          gridHTML += '</tr>';
      gridHTML += '</thead>';
      gridHTML += '<tbody>';
			for(var i = 0; i<tracks.items.length; i++)
      {
        gridHTML += '<tr>';
            gridHTML += '<td class="selectable">';
                gridHTML += '<input type="checkbox">'
            gridHTML += '</td>';
            gridHTML += '<td>'+tracks.items[i].track.name+'</td>';
            gridHTML += '<td>'+tracks.items[i].track.album.name+'</td>';
            gridHTML += '<td>'+tracks.items[i].track.artists[0].name+'</td>';
        gridHTML += '</tr>';
      }
      gridHTML += '</tbody>';
      console.log(gridHTML)
			$('.picky table').html(gridHTML);
			//var songsGrid = new songsGrid(tracks);
}