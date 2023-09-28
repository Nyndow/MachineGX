import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDOption extends Component {
  render() {
    return (
        <div><CRUD entity="option" idField="idOption" columns={['idCommand', 'optionDescription', 'optionSyntax','optionComment','targetIn']} /></div>
    )
  }
}
