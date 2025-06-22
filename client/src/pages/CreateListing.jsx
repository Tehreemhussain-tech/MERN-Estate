import {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const CreateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
    // const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 50,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    //handleSubmit function
    const [error, setError] = useState(false); 
    const [loading, setLoading] = useState(false);
    console.log(formData);
    
    //handle image upload
    const handleImageSubmit = (e) => {
        
        //check file and image limits
        if(files.length > 0 && files.length + formData.imageUrls.length < 7 ){
            setUploading(true);
            setImageUploadError(false);

            //prepare form data to send files to backend
            const formDataToSend = new FormData();
            for(let i =0; i< files.length; i++){
                formDataToSend.append('images', files[i]);
            }

            try {
                const res = fetch('api/listing/upload-images', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (!res.ok) throw new Error('Server error');

                const data = res.json();

                //data.uploadedUrls will be array of file paths
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(data.uploadedUrls),
                });
                setUploading(false);
            } catch (error) {
                setImageUploadError('You can only upload up to 6 images per listing.')
                setUploading(false);
            }
        }
    }

// function handle change
const handleChange = (e) => {
  
  //condition -> type (rent or sale)
  if(e.target.id === 'sale' || e.target.id === 'rent'){
    setFormData({
      ...formData,
      type: e.target.id
    })
  }

  //condition -> boolean(parking, furnished, offer)
  if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === "offer"){
    setFormData({
      //keep previous data inside form data
      ...formData,
      [e.target.id]: e.target.checked
    })
  }

  //condition -> bathrooms, bedrooms, regularPrice, discountedPrice, name, description, address
  if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
    setFormData({
      ...formData,

      //use bracket to get variable instead of value
      [e.target.id]: e.target.value

    })
  };
};

//handle submit function
const handleSubmit = async(e) => {
  //prevent refreshing the page
  e.preventDefault();
  try {
    setLoading(true);

    //remove previous error.
    setError(false);
    const res = await fetch('api/listing/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if(data.success === false){
      setError(data.message);
    }

  } catch (error) {
    //create state to track error
    setError(error.message);
    setLoading(false);
  }
}
    
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* inside form -> two columns on large screens, one column -> small screens */}

        {/* INPUT FIELDS - 1ST COLUMN*/}
        <div className="flex flex-col gap-4 flex-1">

          {/* name input */}
          <input
            type="text"
            placeholder="Name"
            className="bg-white border border-slate-200 p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          {/* description input */}
          <textarea
            type="text"
            placeholder="Description"
            className="bg-white border border-slate-200 p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          {/* address input */}
          <input
            type="text"
            placeholder="Address"
            className="bg-white border border-slate-200 p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* CHECKBOXES - SECTION 2 DIV */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange}
            checked={formData.type === "sale"} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" 
              onChange={handleChange}
              checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" 
              onChange={handleChange}
              checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" 
              onChange={handleChange}
              checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" 
              onChange={handleChange}
              checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* SECTION-3 DIV - beds, baths, price */}
          <div className="flex flex-wrap gap-6">
            
            {/* Beds Div */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="bg-white p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            {/* Baths Div */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="baths"
                min="1"
                max="10"
                required
                className="bg-white p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            {/* Regular Price Div */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="bg-white p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              {/* regular price text */}
              <div className="flex  flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>

            {/* Discounted Price Div */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="50"
                max="1000000"
                required
                className="bg-white p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.discountPrice}
              />

              {/* discounted price text */}
              <div className="flex  flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
          {/* -------Section-3 -end -------------------------------------------------------*/}
        </div>

        {/* 2nd-COLUMN */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          {/* input -> choose files & upload button div */}
          <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)}
              className=" p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button type="button" onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer">
              Upload
            </button>
          </div>

          {/* CREATE LISTING BUTTON */}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-85 cursor-pointer">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
