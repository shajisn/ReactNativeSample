/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react';

import {
  AppRegistry,
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableOpacity,
  AlertIOS
} from 'react-native';


/*
var React = require('react-native');

var {
  AppRegistry,
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableOpacity,
  AlertIOS,
} = React;
*/

import NavigationBar from 'react-native-navbar';

import PreviosButton from './PreviosButton';
import NextButton from './NextButton';
import Title from './Title';

var MovieCell = require('./MovieCell');
var MovieScreen = require('./MovieScreen');

var SearchScreen = require('./SearchScreen');
var GridScreen = require('./GridScreen');
var VideoPlayer = require('./VideoPlayer');

var BRIGHT_COVE_URL = 'http://api.brightcove.com/services/library';
var PARAMS = '?command=find_playlist_by_id&media_delivery=http&playlist_id=3980329817001&token=qQHltr60LJDcWjisvMp8sMgz6_3JDiXhbodHQKCQQhftLXaS5yHRHA..';
var REQUEST_URL = BRIGHT_COVE_URL + PARAMS;

var styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  customButton: {
    width: 24,
    height: 24,
    left: 10,
    bottom: 5
  }
});

var prevImage = 'http://cdn.flaticon.com/png/256/34097.png';
var nextImage = 'http://cdn.flaticon.com/png/256/64410.png';
var titleUri = 'https://pbs.twimg.com/profile_images/2643489197/2533a80926d7c8fc8c37eaa6becffe68_normal.png';

function showSearchScreen(inst: React.Component) {
  //console.log('inst', inst);

  // debugger
  // AlertIOS.alert('inst', inst);

  inst.push({
    title: "Search Movies",
    component: SearchScreen
  });
}

function showGridScreen(inst: React.Component) {
  //console.log('inst', inst);
  inst.push({
    title: "Movies",
    component: GridScreen
  });
}

/**
 * Custom `Prev` button component
 */
class CustomPrev extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => showSearchScreen(this) }>
        <React.Image
          source={{uri: prevImage}}
          style={styles.customButton} />
      </TouchableOpacity>
    );
  }
}

/**
 * Custom `Next` button component
 */
class CustomNext extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => showGridScreen(this) }>
        <React.Image
          source={{uri: nextImage}}
          style={{width: 24, height: 24, right: 10, bottom: 5}} />
      </TouchableOpacity>
    );
  }
}

/**
 * Content component
 * Would be shown under navbar
 */
class Content extends React.Component {
  render() {
    return (
      <View style={{width: 0, height: 0, right: 0, bottom: 0}}>
      </View>
    );
  }
}

/**
 * Custom `Title` component
 */
class CustomTitle extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => AlertIOS.alert('Hello!!! How are you?') }>
        <React.Image
          source={{uri: titleUri}}
          style={{width: 32, height: 32}} />
      </TouchableOpacity>
    );
  }
}

// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

var NoMovies = React.createClass({
  render: function() {
    var text = '';
    if(this.props.isLoading) {
      text = 'Loading movies ...';
    }
    else if (this.props.filter) {
      text = `No results for “ ${this.props.filter}” `;
    }
    else {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No movies found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noMoviesText}>{text}</Text>
      </View>
    );
  }
});

var HomeScreen = React.createClass({

  timeoutID: (null: any),

  getInitialState: function() {
    //this.queryBrightCove();
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
    };
  },


  //Initial API call made after rendering is done
  componentDidMount: function() {

    this.queryBrightCove('all');
  },

  queryBrightCove: function(query: string) {
    this.timeoutID = null;

    this.setState({filter: query});

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      }
      else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
    });

    fetch(REQUEST_URL)
      .then((response) => response.json())

      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })

      .then((responseData) => {
        LOADING[query] = false;

        resultsCache.totalForQuery[query] = responseData.videos.length;
        resultsCache.dataForQuery[query] = responseData.videos;

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseData.videos),
        });
      })
      .done();
  },

  getDataSource: function(videos: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(videos);
  },

  renderRow: function(video: Object)  {
    return (
      <MovieCell
        onSelect={() => this.selectMovie(video)}
        video={video} />
    );
  },

  selectMovie: function(video: Object) {
    /*
    debugger
    AlertIOS.alert('Playing ' + video.renditions[0].url);
    */
    this.props.navigator.push({
      title: video.renditions[0].url,
      component: VideoPlayer,
      navigationBar: this.refs.nav.navigationBar,
      passProps: {videoUrl: video.renditions[0].url},
    });
    // this.refs.nav.replace({
    //   title: video.renditions[0].url,
    //   component: VideoPlayer,
    //   navigationBar: this.refs.nav.navigationBar,
    //   passProps: {videoUrl: video.renditions[0].url},
    // });
  },

  renderScene: function(routeInst, navigatorInst) {
    //console.log('routeInst', routeInst);
    //console.log('navigatorInst', navigatorInst);
    //var Component = routeInst.component;
    var navBar = routeInst.navigationBar;

    if (navBar) {
      //navBar = React.addons.cloneWithProps(navBar, {
        navBar = React.cloneElement(navBar, {
        navigator: navigatorInst,
        route: routeInst
      });
    }

    var content = this.state.dataSource.getRowCount() === 0
      ? // No result condition
      <NoMovies
        filter={this.state.filter}
        isLoading={this.state.isLoading} />
      : //Else condition
      <View style={{ flex: 1, backgroundColor: '#ff9900' }}>
      <NavigationBar
        title={<Title/>}
        leftButton={
          <PreviosButton
            style={{ marginLeft: 8 }}
            onPress={() => showGridScreen(this.props.navigator) }/>}
        rightButton={
          <NextButton
            style={{ marginRight: 8 }}
            onPress={() => showSearchScreen(this.props.navigator) }/>} />
        <ListView
          ref="listview"
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false} />
      </View>;


    return content;

    // return (
    //   <View style={styles.navigator}>
    //     {navBar}
    //     <Component navigator={navigator} route={route} />
    //     {content}
    //   </View>
    // );

    // return (
    //   <View style={styles.navigator} >
    //     {navBar}
    //     <View style={styles.separator} />
    //      {content}
    //   </View>
    // );
  },

  render: function() {
    return (
      <Navigator
        style={styles.navigator}
        ref='nav'
        renderScene={this.renderScene}
        initialRoute={{
          component: Content,
          navigationBar: <NavigationBar
            customPrev={<CustomPrev/>}
            customTitle={<CustomTitle/>}
            customNext={<CustomNext/>} />
        }} />
    );
  },

});


module.exports = HomeScreen;
