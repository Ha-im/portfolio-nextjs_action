import Image from "next/image";
import { createClient } from '@/utils/supabase/client';

export default async function Home() {
  const supabase = await createClient();
  const {data : projects, error} = await supabase
  .from("portfolio")
  .select()
  .order('id', { ascending: false })
  .limit(3)
  ;
  const  getPublicURL = (path)=>{
    const { data } = supabase
    .storage
    .from('portfolio')
    .getPublicUrl(path)
    return data.publicUrl;
  }
  console.log(projects);
  if(error){
    console.log('데이터 조회 실패',error)
    return <div>데이터 조회 실패</div>
  }
  return (
    <>
      <div className="container latest_portfolio">
      <div className="row intro">
        <div className="col-md-4">
            <div className="contents shadow">
                <h2 className="heading2">I&apos;m alikerock</h2>
            </div>
        </div>
        <div className="col-md-4">
            <div className="contents shadow">
                <h2 className="heading2">I create super awesome stuff</h2>
            </div>
        </div>
        <div className="col-md-4">
            <div className="contents shadow">
                <h2 className="heading2">I&apos;m available for freelance projects</h2>
            </div>
        </div>
      </div>
      <div className="row list">
      {
      projects.map(i => 
        <div className="col-md-4" key={i.id}>
        <div className="contents shadow">
          <Image src={getPublicURL(i.thumbnail)} width={364} height={209} alt={i.title}/>
          <div className="hover_contents">
              <div className="list_info">
                  <h3><a href={`/project/${i.id}`}>{i.title}</a> <Image src="/images/portfolio_list_arrow.png" width={6} height={8} alt="list arrow"/></h3>
                  <p><a href={`/project/${i.id}`}>Click to see project</a></p>
              </div>
            </div>
          </div>
        </div>
      )
      }
      </div>
        
      </div>
    </>
  );
}
