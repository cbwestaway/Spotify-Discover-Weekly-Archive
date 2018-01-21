function getTracks()
{

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

		var params = getHashParams();
        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;
        if (error) {
          alert('There was an error during the authentication');
        } else { 
          if (access_token) {
	//var get_DiscoverWeekly = function(){
		var get_DiscoverWeekly = new Promise(function(resolve,reject)
            {
              $.ajax({
                  url: 'https://api.spotify.com/v1/me/playlists',
                  headers: {
                    'Authorization': 'Bearer ' + access_token
                  },
                  success: function(response) {
                  response.items.forEach(function(item){
                   if(item.name == "Discover Weekly")
                   {
                      alert('name: ' +item.name + ' ID: ' + item.id);
                      resolve(item.id);
                   }
                  });
                }
              });
              return get_DiscoverWeekly;
            });
	//}
            var getDiscoverTracks = function(playlist_id){
              var tracksPromise = new Promise(function(resolve, reject){
                  $.ajax({
                    url: 'https://api.spotify.com/v1/users/spotify/playlists/'+ playlist_id + '/tracks?offset=0&limit=100',
                    headers: {
                      'Authorization': 'Bearer ' + access_token
                    },
                    success: function(tracks) {
                    /*
                      var playListUpdate = [];
                      tracks.items.forEach(function(item){
                          playListUpdate.push("spotify:track:" + item.track.id);
                      });
                      console.log(playListUpdate);
                      resolve(playListUpdate);
                      */
                      resolve(tracks);
                      console.log(tracks);
                    }
                  });
               })
              return tracksPromise;
            }
    	}
    	get_DiscoverWeekly
    	.then(getDiscoverTracks)
    	.then(buildSongsGrid)
	}
}