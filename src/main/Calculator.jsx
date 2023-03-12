import { Component } from "react";
import './Calculator.css'
import CpButton from "../components/CpButton";
import CpDisplay from "../components/CpDisplay";


const initialState = {
    displayValue:'0',
    clearDisplay:false,
    operation:null,
    values:[0,0],
    current:0
}

export default class Calculator extends Component {
    
    state = {...initialState}

    constructor(props){
        super(props)

        this.clearMemory = this.clearMemory.bind(this)
        this.setOperations = this.setOperations.bind(this)
        this.addDigit = this.addDigit.bind(this)
    }

        limitDisplay(val){
        if (val[0].toString().length > 10) {
            let maxLength = 9
            let parts = val[0].toString().split('.')
        
            if (parts[0].toString().length > 8) {
                this.setState({ ...initialState })
                this.setState({ displayValue: 'ERRO', clearDisplay: true })
            } else if (parts[1] === '' ){
                this.setState({ displayValue: parts[0] })
            } else {
                parts[1] = parts[1].substring(0,
                    (maxLength - parts[0].toString().length))
                
                this.setState({
                    displayValue: parts.join('.')
                })
            }
          }
        }
    

    clearMemory() {
        this.setState({...initialState})
    }

    resultToDisplay(value){
        const sizeValue = value.toString().length
        return sizeValue >= 9 ? value.toPrecision(9) : value
    }


    setOperations(operation){
        if(this.state.current === 0){
            this.setState({ operation, current:1, clearDisplay:true, displayValue:'0'})
        } else {
            const equals = operation === '='
            const currentOperation = this.state.operation
            const values = [...this.state.values]
            
            try{
                switch (currentOperation) {
                    case '+':
                        values[0]= (values[0] + values[1])
                        break;
                    case '-':
                        values[0]= (values[0] - values[1])
                        break;
                    case '*':
                        values[0]= (values[0] * values[1])
                        break;
                    case '/':
                        values[0]= (values[0] / values[1])
                        break;
                    default:
                        values[0] = this.state.values[0]
                        break;
                }

                if(isNaN(values[0]) || !isFinite(values[0])){
                    this.clearMemory()
                    return
                }
            } catch(err) {
                values[0] = this.state.values[0]
            }
            values[1]=0

            this.setState({
                displayValue: this.resultToDisplay(values[0]),
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values,
            })
        }
    }

    addDigit(val){
        if(val === '.' && this.state.displayValue.includes('.')){
            return
        }
        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

        const currentValue = clearDisplay ? '' : this.state.displayValue
        const newDisplayValue = currentValue + val
        this.setState({displayValue:newDisplayValue, clearDisplay: false})

        if(val !== '.'){
            const idx = this.state.current
            const newValue = parseFloat(newDisplayValue)
            const values = [...this.state.values]
            values[idx] = newValue
            this.limitDisplay(values)
            this.setState({ values })
        }
    }
    
    render(){
        return (
            <div className="calculator">
                <CpDisplay value={this.state.displayValue}/>
                <CpButton label="AC" click={this.clearMemory} triple/>
                <CpButton label="/" click={this.setOperations} operation/>
                <CpButton label="7" click={this.addDigit}/>
                <CpButton label="8" click={this.addDigit}/>
                <CpButton label="9" click={this.addDigit}/>
                <CpButton label="*" click={this.setOperations} operation/>
                <CpButton label="4" click={this.addDigit}/>
                <CpButton label="5" click={this.addDigit}/>
                <CpButton label="6" click={this.addDigit}/>
                <CpButton label="-" click={this.setOperations} operation/>
                <CpButton label="1" click={this.addDigit}/>
                <CpButton label="2" click={this.addDigit}/>
                <CpButton label="3" click={this.addDigit}/>
                <CpButton label="+" click={this.setOperations} operation/>
                <CpButton label="0" click={this.addDigit} double/>
                <CpButton label="." click={this.addDigit}/>
                <CpButton label="=" click={this.setOperations} operation/>
            </div>
        )
    }
}