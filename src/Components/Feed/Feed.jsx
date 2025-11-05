import React, { useEffect, useState, useCallback } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const videoList_Url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=20&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

      const response = await fetch(videoList_Url);
      const json = await response.json();

      console.log("Fetched videos:", json);
      setData(json.items || []); // Fallback if items is undefined
    } catch (error) {
      console.error("Error fetching videos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#888' }}>Loading videos...</p>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888' }}>No videos found.</p>;
  }

   return (
    <div className="feed">
         {data.map((item,index)=>{
             return(
                 <Link to={`video/${item.snippet.categoryId}/${item.id}`} className='card'>
                     <img src={item.snippet.thumbnails.medium.url} alt="" />
                     <h2>{item.snippet.title}</h2>
                     <h3>{item.snippet.channelTitle}</h3>
                     <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()} </p>
                 </Link>
             )
         })}
     </div>
   )
};

export default Feed;
