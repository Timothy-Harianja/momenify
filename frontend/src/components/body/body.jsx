import React, { Component } from "react";
import PostsContainer from "../posts-container/posts-container";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import "./body.css";
import TopRightContainer from "../posts-container/top-right-container";
import CreatePost from "../create-post/create-post";
import axios from "axios";
import PostItem from "../post-item/post-item";
import one from "../images/one.png";
import two from "../images/two.png";
import three from "../images/three.png";
import four from "../images/four.png";
import five from "../images/five.png";
import trend from "../images/trend.png";
class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      uniqueID: null,
      username: null,
      posts: 0,
      idList: [],
      moments: [],
      usernameList: [],
      postidList: [],
      loadingFeedback: "Loading More...",
      likeStatus: [],
      numofLike: [],
      message: [],
      userLogo: [],
      commentList: [],
      postDateList: [],
      hashtagList: [],
      topTrendList: [],
      loadStatus: false,
      filesList: [],
      visitedList: [],
      followStatus: [],
      following: [],
      follower: [],
      uniqueIDList: [],
      followerListInfo: [],
      followingListInfo: [],
      followList: [],
      boolHideList: [],
      reportID: null,
      filterClass: "filter-options",
      filter: null,
      filterStatus: "random",
    };
  }

  componentDidMount() {
    axios.get("/api/getRoute/getHashtag").then((res) => {
      if (res.data.success) {
        this.setState({ topTrendList: res.data.hashtagList });
      }
    });
    axios
      .get("/api/loginRoute/session")
      .then((res) => {
        if (res.data.success) {
          this.setState({
            username: res.data.username,
            userId: res.data.userId,
            uniqueID: res.data.uniqueID,
            logoNumber: res.data.logoNumber,
            following: res.data.following,
            follower: res.data.follower,
          });

          if (this.state.follower.length > 0) {
            axios
              .post("/api/config/getFollower", {
                followerList: this.state.follower,
              })
              .then((followerResult) => {
                this.setState({
                  followerListInfo: followerResult.data.followerResult.filter(
                    (x) => !!x
                  ),
                  followList: followerResult.data.followerResult.filter(
                    (x) => !!x
                  ),
                });
              });
          }
          if (this.state.following.length > 0) {
            axios
              .post("/api/config/getFollowing", {
                followingList: this.state.following,
              })
              .then((followingResult) => {
                this.setState({
                  followingListInfo: followingResult.data.followingResult.filter(
                    (x) => !!x
                  ),
                });
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        this.queryPost();
      });
  }
  queryPost = () => {
    axios
      .post("/api/getRoute/getMoment", {
        visitedList: this.state.postidList,
        filter: this.state.filter,
      })
      .then((res) => {
        for (let i = 0; i < res.data.allMoments.length; i++) {
          this.state.idList.push(res.data.idList[i]);
          this.state.moments.push(res.data.allMoments[i]);
          this.state.usernameList.push(res.data.allUsername[i]);
          this.state.postidList.push(res.data.allPostid[i]);
          this.state.likeStatus.push(false);
          this.state.numofLike.push(res.data.numofLike[i]);
          this.state.userLogo.push(res.data.logoList[i]);
          this.state.commentList.push(res.data.commentList[i]);
          this.state.postDateList.push(res.data.postDateList[i]);
          this.state.hashtagList.push(res.data.hashtagList[i]);
          this.state.filesList.push(res.data.filesList[i]);
          this.state.uniqueIDList.push(res.data.uniqueIDList[i]);
          this.state.posts++;
          this.state.followStatus.push(
            this.state.following.includes(res.data.idList[i]) ? true : false
          );
          this.state.boolHideList.push(true);
        }

        this.setState({
          loadStatus: true,
          loadingFeedback:
            res.data.allMoments.length == 0
              ? "No More New Posts, Come Back Later :)"
              : "Loading More...",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  giveComment = (comment) => {
    if (comment.postComment != null && comment.postComment.trim() != "") {
      comment.userLogo = this.state.logoNumber;
      comment.nickname = this.state.username;
      axios
        .post("/api/postRoute/postComment", comment)
        .then((res) => {
          if (res.data.success == false) {
            alert("Please login to make a comment!");
          } else {
            let newCommentList = this.state.commentList;
            newCommentList[comment.position].push(res.data.message);
            this.setState({ commentList: newCommentList });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Comment cannot be empty!");
    }
  };

  giveLike = (post) => {
    let postId = post.postid;
    axios
      .post("/api/postRoute/giveLike", { postId: postId })
      .then((res) => {
        if (res.data.success) {
          let newlikeStatus = this.state.likeStatus;
          newlikeStatus[post.position] = true;
          let newnumofLike = this.state.numofLike;
          newnumofLike[post.position] += 1;
          this.setState({ likeStatus: newlikeStatus });
          this.setState({ numofLike: newnumofLike });
        } else {
          this.setState({ likeMessage: res.data.message });
          if (res.data.message == "you already liked this post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "you already liked this post";
            alert("you already liked this post");
            this.setState({ message: newMessage });
          }
          if (res.data.message == "please login to like a post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "please login to like a post";
            alert("please login to like a post");
            this.setState({ message: newMessage });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getNumberLogo = (num) => {
    let list = [one, two, three, four, five];
    return list[parseInt(num)];
  };
  showPosts = () => {
    var posts = [];

    if (this.state.loadStatus) {
      for (let i = 0; i < this.state.posts; i++) {
        posts.push(
          <div key={i} className="post">
            <PostItem
              username={
                this.state.usernameList[i] == undefined
                  ? "Anonymous"
                  : this.state.usernameList[i]
              }
              userId={this.state.userId} //user's id
              id={this.state.idList[i]} //comment's user's id
              uniqueID={this.state.uniqueIDList[i]}
              postDate={this.state.postDateList[i]}
              text={this.state.moments[i]}
              likeStatus={this.state.message[i]}
              profileUrl={
                this.state.usernameList[i] == undefined
                  ? "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                  : this.state.userLogo[i]
              }
              postid={this.state.postidList[i]}
              position={i}
              commentsCount={this.state.commentList[i].length}
              giveLike={(e) => this.giveLike(e)}
              giveComment={(e) => this.giveComment(e)}
              likeStatus={this.state.likeStatus[i]}
              numofLike={this.state.numofLike[i]}
              hashtags={this.state.hashtagList[i]}
              comment={this.state.commentList[i]}
              file={this.state.filesList[i]}
              followStatus={this.state.followStatus[i]}
              updateFollow={(e) => this.updateFollow(e)}
              splitPosition={this.getSplitPosition(this.state.moments[i])}
              boolHide={this.state.boolHideList[i]}
              changeBoolReadAll={(position) => this.changeBoolReadAll(position)}
              owned={this.state.uniqueID == this.state.uniqueIDList[i]}
              reportPost={(e) => this.reportPost(e)}
              reportID={(e) => this.reportID(e)}
            />
          </div>
        );
      }
    }
    return posts;
  };

  reportID = (e) => {
    this.setState({ reportID: e.id });
  };

  reportPost = (req) => {
    axios.post("/api/config/reportPost", {
      message: req.message,
      reportID: this.state.reportID,
    });
  };

  addNewPost = (newPost) => {
    let newMoments = [newPost.postmessage, ...this.state.moments];
    let newPostidList = [newPost.postId, ...this.state.postidList];
    let newUsernameList = [newPost.username, ...this.state.usernameList];
    let newLikeStatus = [false, ...this.state.likeStatus];
    let newNumofLike = [0, ...this.state.numofLike];
    let newMessage = ["", ...this.state.message];
    let newLogoList = [newPost.logoNumber, ...this.state.userLogo];
    let newCommentlist = [[], ...this.state.commentList];
    let newPostDateList = [newPost.postDate, ...this.state.postDateList];
    let newHashtagList = [newPost.hashtagList, ...this.state.hashtagList];
    let newIDList = [newPost.userID, ...this.state.idList];
    let newFilesList = [newPost.file, ...this.state.filesList];
    let newFollowStatus = [false, ...this.state.followStatus];
    let newUniqueIDList = [newPost.uniqueID, ...this.state.uniqueIDList];
    let newBoolHideList = [true, ...this.state.boolHideList];

    this.setState({
      idList: newIDList,
      moments: newMoments,
      postidList: newPostidList,
      usernameList: newUsernameList,
      likeStatus: newLikeStatus,
      numofLike: newNumofLike,
      Message: newMessage,
      userLogo: newLogoList,
      commentList: newCommentlist,
      postDateList: newPostDateList,
      hashtagList: newHashtagList,
      posts: this.state.posts + 1,
      filesList: newFilesList,
      followStatus: newFollowStatus,
      uniqueIDList: newUniqueIDList,
      boolHideList: newBoolHideList,
    });
  };

  updateFollow = (req) => {
    var idList = this.state.idList;
    var followStatus = this.state.followStatus;
    for (let i = 0; i < idList.length; i++) {
      if (idList[i] == req.id) {
        followStatus[i] = !followStatus[i];
      }
    }
    this.setState({ followStatus: followStatus });
    //update following list
    if (req.action == "follow") {
      this.state.following.push(req.id);
    } else {
      this.state.following.filter((item) => item != req.id);
    }
  };

  changeToFollower = () => {
    this.setState({ followList: this.state.followerListInfo });
  };

  changeToFollowing = () => {
    this.setState({ followList: this.state.followingListInfo });
  };

  getSplitPosition = (text) => {
    var edgeLength = 300;
    var textLength = text.length + (text.match(/\n/g) || []).length * 80; //text length plus number of "\n"*80

    if (textLength <= edgeLength) {
      return 0;
    }
    var retVal = 300;
    var shortText = text.slice(0, 300);
    if ((shortText.match(/\n/g) || []).length >= 4) {
      //find the position of the 4th happened \n
      var spl = shortText.split("\n");
      retVal =
        spl[0].length + spl[1].length + spl[2].length + spl[3].length + 3;
      // retVal = shortText.indexOf("\n", shortText.indexOf("\n") + 4) - 1;
    }
    return retVal;
  };

  changeBoolReadAll = (position) => {
    var newBoolHideList = this.state.boolHideList;
    newBoolHideList[position] = !newBoolHideList[position];
    this.setState({ boolHideList: newBoolHideList });
  };

  showFilter = (obj) => {
    if (this.state.filterClass == "filter-options") {
      this.setState({ filterClass: "filter-options filter-options-shown" });
    } else {
      this.setState({ filterClass: "filter-options" });
    }
    if (obj.filter != null) {
      if (obj.filter == "following" && this.state.userId == null) {
        alert("You need to login to see the posts from your following list");
      } else {
        this.setState(
          {
            filterStatus: obj.filter,
            filter: obj.filter,
            posts: 0,
            idList: [],
            moments: [],
            usernameList: [],
            postidList: [],
            likeStatus: [],
            numofLike: [],
            userLogo: [],
            commentList: [],
            postDate: [],
            hashtagList: [],
            filesList: [],
            uniqueIDList: [],
            followStatus: [],
            boolHideList: [],
          },
          () => {
            this.queryPost();
          }
        );
      }
    }
  };

  render() {
    return (
      <div className="body">
        <div className="create-post-container">
          <div className="create-post-div">
            <CreatePost addNewPost={(newPost) => this.addNewPost(newPost)} />
          </div>
        </div>

        <div className="filter">
          <div className="filter-container">
            <div>
              <svg
                class="bi bi-filter-left"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="filter-button" onClick={this.showFilter}>
                FILTER({this.state.filterStatus})
              </span>
            </div>
            <div className={this.state.filterClass}>
              <div>
                <hr className="filter-hr"></hr>

                <table class="alncenter" style={{ width: "65%" }}>
                  <tr>
                    <th>Upload Date:</th>
                    <th>Type:</th>
                    <th>Sort By:</th>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "today" })}
                        className="btn btn-light"
                      >
                        Today{" "}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "video" })}
                        className="btn btn-light"
                      >
                        Video
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "random" })}
                        className="btn btn-light"
                      >
                        Random
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "week" })}
                        className="btn btn-light"
                      >
                        Last Week
                      </button>
                    </td>

                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "image" })}
                        className="btn btn-light"
                      >
                        Image
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "following" })}
                        className="btn btn-light"
                      >
                        Following
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "month" })}
                        className="btn btn-light"
                      >
                        Last Month
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => this.showFilter({ filter: "text" })}
                        className="btn btn-light"
                      >
                        Text
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="home-page">
          <div className="main-posts-container">
            <PostsContainer
              postContent={this.state.postContent}
              resetPostContent={() => this.resetNewPost()}
              loadMorePosts={() => this.queryPost()}
              showPosts={() => this.showPosts()}
              giveLike={(post) => this.giveLike(post)}
              state={this.state}
            />
          </div>
          <div className="side-posts-container">
            <div className="wrapper">
              <div className="box top">
                <div>
                  {this.state.userId == null ? (
                    <img
                      src={
                        "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                      }
                      id="side-profile"
                    />
                  ) : (
                    <a href={"/profile/" + this.state.uniqueID}>
                      <img src={this.state.logoNumber} id="side-profile" />
                    </a>
                  )}

                  <button id="follower" onClick={() => this.changeToFollower()}>
                    {this.state.followerListInfo.length} Followers
                  </button>
                  <button
                    id="following"
                    onClick={() => this.changeToFollowing()}
                  >
                    {this.state.followingListInfo.length} Following
                  </button>
                </div>
                <TopRightContainer
                  follow={this.state.followList}
                  userID={this.state.userId}
                />
              </div>
              <div className="box middle">
                <div id="trending-hashtag">
                  <img src={trend} alt="kun" className="trend-img" />
                  &nbsp;&nbsp;&nbsp;Trending:
                </div>
                <span class="line-fade"></span>
                <div id="trend-list">
                  <ul>
                    {this.state.topTrendList.map((tag, index) => (
                      <a href={"/hashtag/" + tag.substring(1)}>
                        <li>
                          <img
                            src={this.getNumberLogo(index)}
                            alt="kun"
                            className="trend-img"
                          />
                          <h3>{tag}</h3>
                        </li>
                      </a>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="box-bottom box">
                <a href="/about-us">About</a>
                <a href="/contact-us">Contact Us</a>
                <a href="/policy">Policy</a>
                <a href="/careers">Careers</a>
              </div>
              <p style={{ color: "grey" }}> Momenify © 2020</p>
            </div>
          </div>
        </div>
        {/* <div className='side-posts-container'>
          <PostsContainer/>
        </div> */}
        <ScrollUpButton />
      </div>
    );
  }
}

export default Body;
