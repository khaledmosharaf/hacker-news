// 2921983

import { useEffect, useState } from 'react';

const App = () => {
  const [comment, setComment] = useState({});
  const [kids, setKids] = useState([]);

  useEffect(() => {
    fetchComment(2921983);
  }, []);

  const fetchComment = (id) => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
      .then((response) => response.json())
      .then((comment) => {
        setComment(comment);

        console.log('old', comment);
      });
  };
  // Implement so that on click of any child, the child becomes the parent and the grandchildren become the children
  const fetchKids = async (kids) => {
    await Promise.all(
      kids.map((kid, i, kids) => {
        return fetch(
          `https://hacker-news.firebaseio.com/v0/item/${kid}.json?print=pretty`
        )
          .then((res) => res.json())
          .then((kidComment) => {
            kids[i] = { ...kidComment };
          });
      })
    );
    setKids(kids);
    console.log('new', kids);
  };

  const checkNFetchKids = (currentComment) => {
    if ('kids' in currentComment) {
      fetchKids(currentComment.kids);
    } else {
      return undefined;
    }
  };

  return (
    <div className="App" style={{ margin: '50px' }}>
      <h1>Comment Tree</h1>
      {comment && (
        <h2>
          <span style={{ color: 'red' }}>parent: </span> {comment.text}
          <span
            style={{
              color: 'darkgoldenrod',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
            onClick={() => checkNFetchKids(comment)}
          >
            [
            {'kids' in comment ? `${comment.kids.length} replies` : '0 replies'}
            ]
          </span>
        </h2>
      )}

      {kids &&
        kids.map((kid) => {
          if ('deleted' in kid) {
            return (
              <h2
                key={Math.random()}
                style={{ color: 'grey', marginLeft: '25px' }}
              >
                [Comment Deleted]
              </h2>
            );
          }
          return (
            <h2 style={{ marginLeft: '25px' }} key={Math.random()}>
              <span style={{ color: 'green' }}>kid: </span>
              {kid.text}
              <span
                style={{ color: 'darkgoldenrod', cursor: 'pointer' }}
                onClick={() => checkNFetchKids(kid)}
              >
                [{'kids' in kid ? `${kid.kids.length} replies` : '0 replies'}]
              </span>
            </h2>
          );
        })}
    </div>
  );
};

export default App;
