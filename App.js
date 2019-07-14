import React,{Component} from 'react';
import { StyleSheet,Modal ,Text,ScrollView ,View ,Button,TouchableOpacity,Image,TouchableHighlight,FlatList,TextInput} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';



export default class App extends Component{
  state={
   arr:[],
    pic:'',
    modalVisible:false,
    photo:'',
    addphoto:false,
    months:['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'],
    foredit:false,
    captured:false,
    showbtn:true
  }
  opencam(){
    console.log('opencam()');
this.setState({addphoto:true});

  }
  save(){
    const time = new Date;
    var obj={photo:this.state.pic,hrs:time.getHours(),mins:time.getMinutes(),day:time.getDay()};
      var before=[...this.state.arr];
      before.push(obj);
      console.log(before,'photos');
      this.setState({arr:before,captured:false,addphoto:false})
  }
  del(i){
    const {arr}=this.state;
    var newarr=[];
    for(x=0;x<arr.length;x++){
      if(x!=i){
        newarr.push(arr[x]);
      }  
  }
  this.setState({arr:newarr})
  }
  edit(i){
console.log(i)
  this.setState({editIndex:i,foredit:true,addphoto:true});
  
  }
  saveEdit(){
    const {arr,editIndex}=this.state
    arr[editIndex].photo=this.state.pic;
    console.log('arr',arr);
    this.setState({arr:arr,foredit:false,captured:false,addphoto:false});
  }
  close(){
    this.setState({addphoto:false});
  }
 async capture(){
    const photo= await this.camera.takePictureAsync();
    this.setState({captured:true,pic:photo.uri})
                 
  }
  renderModal(){
    return (<Modal
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={{flex:1,justifyContent:'center',padding:20,width:200,height:200}}>
        <View>
          <Text>Hello World!</Text>

          <TouchableHighlight
            onPress={() => {
              this.setState({modalVisible:false})
            }}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>)
   
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  bigpic(i){
    const {arr}= this.state;
    this.setState({pic:arr[i].photo,captured:true,showbtn:false})
  }
  delAll(){
    this.setState({arr:[]})
  }
  render() {
    console.log(this.state.arr,'arr');
    const { hasCameraPermission,addphoto,arr } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1,margin:0,width:'100%' }}>
        { !!addphoto && !this.state.captured && <Camera 
          ref={(ref)=>{
            this.camera= ref
          }}   
          style={{ flex: 1 }} type={this.state.type}>
            <View style={{flex:1,alignItems:'flex-end',margin:20}}>
            <TouchableOpacity onPress={this.close.bind(this)}>
                  <Image style={{width:30,height:30}} source={require('./assets/closeIcon.png')} />
                </TouchableOpacity>

            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent:'flex-end',
                alignItems:"center",

              }}>
                
                <TouchableOpacity onPress={this.capture.bind(this)}>
                <Image style={{width:60,height:60}} source={require('./assets/cap.png')}/>  
                </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
               <Image style={{width:50,height:50,marginTop:-55}} source={require('./assets/flip.png')}/>
              </TouchableOpacity>
            </View>
          </Camera>
        }
        {!!this.state.captured && 
        <View>
        <Image style={{width:'100%',height:'95%'}} source={{uri:this.state.pic}} />
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
      {  !!this.state.showbtn && <Button onPress={!this.state.foredit ? this.save.bind(this):this.saveEdit.bind(this)} title='Ok'/>}
       <Button  onPress={()=>{this.setState({captured:false,showbtn:true})}} title='Cancel'/>
          </View>                                
        </View>}




        {!addphoto && <View style={{flex:1,paddingTop:20,alignItems:'center'}}>
          <View style={{backgroundColor:'#33BBFF',width:'100%',alignItems:'center',padding:30}}>
              <Text style={{fontSize:40,padding:10,color:'white'}}>PHOTO TODOS</Text>
          </View>
              <ScrollView style={{flex:1,flexDirection:'column',width:'100%'}}>
      
        {!!arr.length ?
          arr.map((e,i)=>{
            console.log(e,'e');
           return <View key={i} 
                  style={{flex:1,flexDirection:'row',borderBottomWidth:1,width:'100%',justifyContent:'space-around',alignItems:'center',padding:10,margin:10}}> 
            <TouchableOpacity onPress={this.bigpic.bind(this,i)}>
             <Image style={{width:150,height:150,}} source={{uri:e.photo}} />
            </TouchableOpacity>
              <Text>{e.hrs}:{e.mins}</Text>
              <Text>{this.state.months[e.day]}</Text>
              <View style={{alignSelf:'center'}}>
              <Button onPress={this.del.bind(this,i)} title="delete"/>
              <Button onPress={this.edit.bind(this,i)} title="Edit"/>
              </View>
              </View> 
          }): 
          <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:100}}>
          <Text style={{fontSize:20}}>you have no TODO right now</Text>
          </View>
        }
              </ScrollView> 
              <View style={{height:100,backgroundColor:'#33BBFF',width:'100%',justifyContent:'center'}}>
              <Button color='white' onPress={this.opencam.bind(this)}  title='Add Todo'/>
              <Button color='white' onPress={this.delAll.bind(this)}  title='Delete All'/>
                </View>         
      </View>
}
        
        </View>
      );
    }
  }

  }


