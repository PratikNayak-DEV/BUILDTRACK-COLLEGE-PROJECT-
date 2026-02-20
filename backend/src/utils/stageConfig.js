/**
 * Ordered construction stages and their corresponding completion weights.
 */
const STAGE_WEIGHTS = {
  Foundation: 20,
  Superstructure: 50,
  Facade: 70,
  Interiors: 90,
  Furnishing: 100,
};

/**
 * Keyword dictionary used to map detected labels from Vision API
 * to a specific construction stage.
 */
const STAGE_KEYWORDS = {
  Foundation: ['steel bar', 'rebar', 'excavation', 'trench', 'concrete footing', 'foundation', 'pile'],
  Superstructure: ['column', 'beam', 'slab', 'framework', 'scaffold', 'brickwork', 'structure'],
  Facade: ['window', 'glass', 'plaster', 'exterior wall', 'elevation', 'cladding', 'facade'],
  Interiors: ['tile', 'paint', 'false ceiling', 'drywall', 'interior', 'flooring', 'wall finish'],
  Furnishing: ['sofa', 'lighting', 'furniture', 'table', 'chair', 'bed', 'decor'],
};

const STAGE_ORDER = ['Foundation', 'Superstructure', 'Facade', 'Interiors', 'Furnishing'];

module.exports = {
  STAGE_WEIGHTS,
  STAGE_KEYWORDS,
  STAGE_ORDER,
};
