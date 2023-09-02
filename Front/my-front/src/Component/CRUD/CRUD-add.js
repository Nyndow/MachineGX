import React, { Component } from 'react'

export default class CRUDAdd extends Component {
  render() {
    return (
      <div>
        <form className="crud-form" onSubmit={this.handleSubmit}>
            {columns.map((column) => (
            <div key={column}>
                <label htmlFor={column}>{column}: </label>
                <input
                type="text"
                id={column}
                name={column}
                value={this.state.selectedData[column] || ''}
                onChange={(e) =>
                    this.setState({
                    selectedData: {
                        ...this.state.selectedData,
                        [column]: e.target.value,
                    },
                    })
                }
                className="crud-form-input"
                />
            </div>
            ))}
            <button type="submit" className="crud-form-button">
            Save
            </button>
    </form>
      </div>
    )
  }
}
