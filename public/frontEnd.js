
 var user = {};
 var spotify = {};

//  Obtains parameters from the hash of the URL
// @return Object
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
  q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
    return hashParams;
}

function spotifyAPI ()
{
	//  Obtains parameters from the hash of the URL
	// @return Object
	 (function () {
  		var hashParams = {};
  		var e, r = /([^&;=]+)=?([^&;]*)/g,
  		q = window.location.hash.substring(1);
  		while ( e = r.exec(q)) {
      		hashParams[e[1]] = decodeURIComponent(e[2]);
  		}

        this.access_token = hashParams.access_token,
        this.refresh_token = hashParams.refresh_token,
        this.error = hashParams.error;
	})();

	spotifyAPI.prototype.getUser = function(){
		return new Promise(function(resolve, reject){
                $.ajax({
                      url: 'https://api.spotify.com/v1/me',
                      headers: {
                        'Authorization': 'Bearer ' + this.access_token
                      },
                      success: function(userData) {
                        resolve(userData);
                      }
                    });
              });
	}

	spotifyAPI.prototype.get_DiscoverWeekly = function(){
		return new Promise(function(resolve,reject)
            {
              $.ajax({
                  url: 'https://api.spotify.com/v1/me/playlists',
                  headers: {
                    'Authorization': 'Bearer ' + this.access_token
                  },
                  success: function(response) {
                  response.items.forEach(function(item){
                   if(item.name == "Discover Weekly")
                   {
                      alert('name: ' +item.name + ' ID: ' + item.id);
                      resolve(item.id);
                    ///save to db 
                   }
                  });
                }
              });
            });
	}
	 

	spotifyAPI.prototype.get_DiscoverTracks = function(playlist_id){
		return new Promise(function(resolve, reject){
                  $.ajax({
                    url: 'https://api.spotify.com/v1/users/spotify/playlists/'+ playlist_id + '/tracks?offset=0&limit=100',
                    headers: {
                      'Authorization': 'Bearer ' + this.access_token
                    },
                    success: function(tracks) {
       
                      		var playListUpdate = [];
                      		tracks.items.forEach(function(item){
                          	playListUpdate.push("spotify:track:" + item.track.id);
                      	});
                      	resolve(playListUpdate);
                    }
                  });
               })
	}

	spotifyAPI.prototype.get_ArchivePlaylist = function(playListUpdate){
		return new Promise(function(resolve, reject){
                      $.ajax({
                        url: 'https://api.spotify.com/v1/me/playlists',
                        headers: {
                        'Authorization': 'Bearer ' + this.access_token
                        // 'uris': {'uris': playListUpdate, 'position': 0}
                        },
                      success: function(playlists) {
                        playlists.items.forEach(function(item){
                          var data = {};
                          data.tracks = playListUpdate;
                          if(item.name == "Discover Weekly Archive")
                          {
                            console.log(item);
                            data.dest_id = item.id;
                            resolve(data); console.log(data);
                          }
                        })
                      }
                    });
                })
	}

	spotifyAPI.prototype.get_LastUpdated = function(data){
		return new Promise(function(resolve, reject){
                      $.ajax({
                        url: 'https://api.spotify.com/v1/users/' + user.id + '/playlists/' + data.dest_id + '/tracks?offset=0&limit=1',
                        headers: {
                        'Authorization': 'Bearer ' + this.access_token
                        },
                      success: function(tracks) {
                        tracks.items.forEach(function(item){
                          console.log(item);
                         var cur_date = new Date();
                          var added_date = item.added_at.split('T');
                          var last_updated = new Date(added_date[0]);
                          //if(cur_date.getDay() < last_updated.getDay() || (cur_date.getDate() - last_updated.getDate) >= 7)
                            resolve(data); 
                          //else
                            //reject();
                        })
                      }
                    });
                });
	}

	spotifyAPI.prototype.init = function(){
        if (this.error) {
          alert('There was an error during the authentication');
        } else {
        	console.log(this);
         this.getUser().then(function(userData){
           user = userData;
           $('img').attr('src', user.images[0].url)
        });
      }   
      var body = $('body');
      init_bindings(body);
	}

	spotifyAPI.prototype.archiveAll = function(){
        if (error) {
          alert('There was an error during the authentication');
        } else { 
          if (access_token) {
            // render oauth info
            this.get_DiscoverWeekly()
            .then(this.get_DiscoverTracks)
            .then(this.get_ArchivePlaylist)
            .then(this.get_LastUpdated)
           .then(function(data){
              var uris = {"uris": data.tracks, "position": 0};
              var body = JSON.stringify(uris);
              console.log(body);
                      $.ajax({
                        method: 'POST',
                        url: 'https://api.spotify.com/v1/users/' + user.id + '/playlists/' + data.dest_id + '/tracks',
                        headers: {
                          'Authorization': 'Bearer ' + access_token,
                          'Content-Type': 'application/json'
                        },
                        data: body,
                      success: function(ressponse) {
                      }
                    }); 
                    console.log('songs added');
                    $('.messageBox .loading').addClass('vanish');
                    $('.messageBox .complete').removeClass('vanish')
            }); 
          } else {
              console.log('toobad');
          }
            $.ajax({
              url: '/refresh_token',
              data: {
                'refresh_token': refresh_token
              }
            }).done(function(data) {
              access_token = data.access_token;
             
            });
        }
	}


	spotifyAPI.prototype.pickySelect = function(wholeObject){
        if (error) {
          alert('There was an error during the authentication');
        } else { 
          if (access_token) {
            // render oauth info
            this.get_DiscoverWeekly()
            .then(this.get_DiscoverTracks)
            .then(buildSongsGrid);
          } else {
              console.log('toobad');
          }
            $.ajax({
              url: '/refresh_token',
              data: {
                'refresh_token': refresh_token
              }
            }).done(function(data) {
              access_token = data.access_token;
             
            });
        }
	}

	this.init();

}

(function(){
	spotify = new spotifyAPI();
})();
      
function init_bindings(body)
{
 body.on('click', '#archiveAllBtn', function(){

 		spotify.archiveAll();
        // Show the loading message
        $('.optionBtns').addClass('vanish');
        $('.messageBox .loading').removeClass('vanish')
        
    });
    
  body.on('click', '#pickyBtn', function(){
    $('.container.main').addClass('vanish');
    $('.container.picky').removeClass('vanish');
    spotify.pickySelect(true);
  });
}