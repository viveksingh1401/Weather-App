import React,{Component}from 'react'


import './App.css'

class App extends Component{
  constructor(){
    super();
    this.state={
      city:"",
      weather:null,
      error:"",
      loading:false,
      theme:"light",
      currentunit:"C",
      forecast:[]

    }
    this.handleChange=this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.handleTheme=this.handleTheme.bind(this);
    this.handleunit=this.handleunit.bind(this);
  }
  handleChange(event){
   let c=event.target.value;
   this.setState({city:c});
  }
  handleClick(event){
   let c=this.state.city
   if(c==="")
     this.setState({error:"please enter the city"})
    else{
      this.setState({loading:true , error:""})
      
    }
    let url=(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=e64f8a6b2743c8907ac02658b0784838&units=metric`
    )
    let urlforecast=(
      `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&appid=e64f8a6b2743c8907ac02658b0784838&units=metric`
    )
    fetch(url)
       .then(response=>response.json())
       .then(data=>{
        if(!data.main || !data.weather || data.weather.length === 0){
           this.setState({
            error: "Weather data not available for this location",
             loading: false
               });
           return;
          }

        let weather={
         city: data.name,
          temp:data.main.temp, 
          description:data.weather[0].description,
          condition:data.weather[0].main,
          icon:data.weather[0].icon
        }
        console.log(data)
        this.setState({weather:weather,loading:false})
        
         // after getting the data from the server we are disabling the loading
        console.log(weather)
       })
       fetch(urlforecast)
       .then(response=>response.json())
       .then(data=>{
        
        this.setState({forecast:data.list})
        console.log(data.list)
       })
    console.log(this.state.city)
    console.log(url)
  }
  handleTheme(event){
    let appear=this.state.theme
    if(appear==="light")
     this.setState({theme:"dark"})
    else
       this.setState({theme:"light"})
    console.log(this.state.theme)
  }
  handleunit(){
    let u=this.state.currentunit
    if(u=="F")
       this.setState({currentunit:"C"})
    else
       this.setState({currentunit:"F"})
    console.log(this.state.currentunit)
  }
    componentDidUpdate(prevProps, prevState){

    // ✅ Stop if weather not loaded
    if(!this.state.weather) return;

    // ✅ Only run when theme OR weather changes
    if(prevState.theme !== this.state.theme || 
       prevState.weather !== this.state.weather){

      let condition = this.state.weather.condition.toLowerCase();

      // ✅ Normalize conditions
      if(["mist","haze","smoke","fog"].includes(condition)){
        condition="clouds";
      }

      if(["drizzle","thunderstorm"].includes(condition)){
        condition="rain";
      }

      // ✅ Apply both theme + weather
      document.body.className = `${this.state.theme} ${condition}`;
    }
  }
  componentDidMount(){
    document.body.className=this.state.theme;
  }

   render(){
    let displayTemp="";
    if(this.state.weather){
      let celsiusTemp = this.state.weather.temp;
      displayTemp = celsiusTemp;
      if(this.state.currentunit === "F"){
       displayTemp = celsiusTemp * 9/5 + 32;
         }


    }
    return(
      <div className='app'>
      <h1>Weather App by Vivek </h1>
      <input 
       name='CityName'
       value={this.state.city}
       onChange={this.handleChange}
        placeholder='Enter City-Name'
        />
        <button
          name='getweather'
          value={this.state.city}
          onClick={this.handleClick}
          disabled={this.state.loading}

          >Get Weather</button>
          <button
           name='unitconversion'
           value={this.state.currentunit}
           onClick={this.handleunit}
           disabled={this.state.loading}
           >Unit Conversion</button>
          {this.state.error!="" &&  <p className='error'>{this.state.error}</p>}
          {this.state.loading && <div className='spinner'></div>}
           <button 
                name='changetheme'
                value={this.state.theme}
                onClick={this.handleTheme}>Change theme</button>
           {this.state.weather && (
            <div className='weather-card'>
              <img
            className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${this.state.weather.icon}@2x.png`}
                     alt="weather"
                  />

              <p className='city'>{this.state.weather.city}</p>
              <p className='temp'>{displayTemp} °{this.state.currentunit}</p>
              <p className='desc'>{this.state.weather.description}</p>
             
            </div>
          

           )}
            {this.state.forecast.length>0 && (
            <div className='forecast-container'>
               {this.state.forecast.slice(0,5).map(item=>(
                <div className='forecast-card'>
                  {item.main.temp}
                  {item.weather[0].description}
                  {item.dt_txt}
                  </div>)
               )}
               </div>
           )}
          
             
        </div>
    )
   }
}

  


export default App
// Weather app development