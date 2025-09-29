function Sidebar(){
  return(
  <>
   <div className="sidebar-wrapper">
    <div className="side-bar" id="sidebar">
      <h3>Niveau</h3>
      <input type="checkbox" id="niveau1"/><label htmlFor="niveau1"> X1</label><br/>
      <input type="checkbox" id="niveau2"/><label htmlFor="niveau2"> X2</label><br/>
      <input type="checkbox" id="niveau3"/><label htmlFor="niveau3"> X3</label><br/>
      <input type="checkbox" id="niveau4"/><label htmlFor="niveau4"> X4</label><br/>
      <input type="checkbox" id="niveau5"/><label htmlFor="niveau5"> X5</label><br/>

      <h3>Domaine de spécialisation</h3>
      <input type="checkbox" id="dom1"/><label htmlFor="dom1"> Reseau & Infra</label><br/>
      <input type="checkbox" id="dom2"/><label htmlFor="dom2"> Securite</label><br/>
      <input type="checkbox" id="dom3"/><label htmlFor="dom3"> Genie logiciel</label><br/>
      <input type="checkbox" id="dom4"/><label htmlFor="dom4"> Data</label><br/>
      <input type="checkbox" id="dom5"/><label htmlFor="dom5"> Gestion de projet</label><br/>
    </div>
  </div>
  </>
  )
}
export default Sidebar