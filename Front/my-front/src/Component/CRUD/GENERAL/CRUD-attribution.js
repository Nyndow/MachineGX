import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDAttribution extends Component {
  render() {
    return (
      <div><CRUD entity="attribution" idField="idAttribution" columns={['idAttribution', 'id-Machine', 'id-Employee', 'heureDebut','heureFin']} /></div>
    )
  }
}
